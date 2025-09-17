interface WorkerChangeTracker {
  workerId: string;
  lastQRGeneration: string;
  lastDataHash: string;
  generatedIds: string[];
}

interface WorkerIDData {
  workerId: string;
  employeeId: string;
  uniqueCardId: string;
  generatedAt: string;
  isActive: boolean;
}

class WorkerIDManager {
  private static instance: WorkerIDManager;
  private changeTrackers: Map<string, WorkerChangeTracker> = new Map();
  private workerIds: Map<string, WorkerIDData> = new Map();

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): WorkerIDManager {
    if (!WorkerIDManager.instance) {
      WorkerIDManager.instance = new WorkerIDManager();
    }
    return WorkerIDManager.instance;
  }

  private loadFromStorage(): void {
    try {
      const trackers = localStorage.getItem('workerChangeTrackers');
      const ids = localStorage.getItem('workerIds');
      
      if (trackers) {
        const trackersData = JSON.parse(trackers);
        this.changeTrackers = new Map(Object.entries(trackersData));
      }
      
      if (ids) {
        const idsData = JSON.parse(ids);
        this.workerIds = new Map(Object.entries(idsData));
      }
    } catch (error) {
      console.error('Error loading worker ID data from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const trackersObj = Object.fromEntries(this.changeTrackers);
      const idsObj = Object.fromEntries(this.workerIds);
      
      localStorage.setItem('workerChangeTrackers', JSON.stringify(trackersObj));
      localStorage.setItem('workerIds', JSON.stringify(idsObj));
    } catch (error) {
      console.error('Error saving worker ID data to storage:', error);
    }
  }

  private generateUniqueCardId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `TSL-${timestamp}-${random}`.toUpperCase();
  }

  private calculateDataHash(workerData: any): string {
    const relevantData = {
      name: `${workerData.personalInfo.firstName} ${workerData.personalInfo.lastName}`,
      employeeId: workerData.jobInfo.employeeId,
      department: workerData.jobInfo.department,
      role: workerData.jobInfo.role,
      project: workerData.jobInfo.currentProject,
      employmentType: workerData.jobInfo.employmentType,
      status: workerData.status
    };
    
    return btoa(JSON.stringify(relevantData));
  }

  public getOrCreateWorkerID(workerData: any): WorkerIDData {
    const workerId = workerData.id;
    
    // Check if worker already has an ID
    if (this.workerIds.has(workerId)) {
      return this.workerIds.get(workerId)!;
    }
    
    // Create new unique ID
    const uniqueCardId = this.generateUniqueCardId();
    const workerIdData: WorkerIDData = {
      workerId,
      employeeId: workerData.jobInfo.employeeId,
      uniqueCardId,
      generatedAt: new Date().toISOString(),
      isActive: workerData.status === 'active'
    };
    
    this.workerIds.set(workerId, workerIdData);
    
    // Initialize change tracker
    const dataHash = this.calculateDataHash(workerData);
    this.changeTrackers.set(workerId, {
      workerId,
      lastQRGeneration: new Date().toISOString(),
      lastDataHash: dataHash,
      generatedIds: [uniqueCardId]
    });
    
    this.saveToStorage();
    return workerIdData;
  }

  public canRefreshQR(workerData: any): { canRefresh: boolean; reason: string } {
    const workerId = workerData.id;
    const tracker = this.changeTrackers.get(workerId);
    
    if (!tracker) {
      return { canRefresh: true, reason: 'Initial QR generation' };
    }
    
    const currentDataHash = this.calculateDataHash(workerData);
    
    if (currentDataHash !== tracker.lastDataHash) {
      return { canRefresh: true, reason: 'Worker details have been updated' };
    }
    
    return { 
      canRefresh: false, 
      reason: 'No changes detected since last QR generation' 
    };
  }

  public refreshQR(workerData: any): { success: boolean; message: string; newQRData?: any } {
    const refreshCheck = this.canRefreshQR(workerData);
    
    if (!refreshCheck.canRefresh) {
      return {
        success: false,
        message: refreshCheck.reason
      };
    }
    
    const workerId = workerData.id;
    const currentDataHash = this.calculateDataHash(workerData);
    
    // Update tracker
    const tracker = this.changeTrackers.get(workerId);
    if (tracker) {
      tracker.lastQRGeneration = new Date().toISOString();
      tracker.lastDataHash = currentDataHash;
    }
    
    // Get existing worker ID data
    const workerIdData = this.workerIds.get(workerId);
    if (workerIdData) {
      workerIdData.isActive = workerData.status === 'active';
      this.workerIds.set(workerId, workerIdData);
    }
    
    this.saveToStorage();
    
    return {
      success: true,
      message: 'QR code refreshed successfully',
      newQRData: this.createQRData(workerData, workerIdData)
    };
  }

  public createQRData(workerData: any, workerIdData?: WorkerIDData): any {
    const idData = workerIdData || this.getOrCreateWorkerID(workerData);
    
    return {
      workerId: workerData.id,
      employeeId: workerData.jobInfo.employeeId,
      uniqueCardId: idData.uniqueCardId,
      name: `${workerData.personalInfo.firstName} ${workerData.personalInfo.lastName}`,
      department: workerData.jobInfo.department,
      role: workerData.jobInfo.role,
      project: workerData.jobInfo.currentProject || 'Unassigned',
      employmentType: workerData.jobInfo.employmentType,
      status: workerData.status,
      company: 'The Solutionist',
      timestamp: new Date().toISOString(),
      version: '2.0'
    };
  }

  public getWorkerIDData(workerId: string): WorkerIDData | null {
    return this.workerIds.get(workerId) || null;
  }

  public getAllWorkerIds(): WorkerIDData[] {
    return Array.from(this.workerIds.values());
  }
}

export default WorkerIDManager;
export type { WorkerIDData, WorkerChangeTracker };