import React, { useState, useMemo } from 'react';
import { ArrowLeft, Settings, Save, RefreshCw, Shield, DollarSign, Calendar, Users, Bell, Mail, Database, Lock, Eye, EyeOff, Plus, Trash2, Edit, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PayrollSettings {
  general: {
    companyName: string;
    payrollCycle: string;
    payrollStartDate: string;
    currency: string;
    timezone: string;
    fiscalYearStart: string;
  };
  salary: {
    defaultBasicSalaryPercentage: number;
    allowOvertime: boolean;
    overtimeRate: number;
    allowAdvances: boolean;
    maxAdvancePercentage: number;
    autoCalculateDeductions: boolean;
  };
  deductions: {
    pf: { enabled: boolean; employeeRate: number; employerRate: number; };
    esi: { enabled: boolean; employeeRate: number; employerRate: number; };
    tax: { enabled: boolean; autoCalculate: boolean; };
    professionalTax: { enabled: boolean; amount: number; };
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    payslipGeneration: boolean;
    advanceApproval: boolean;
    payrollProcessing: boolean;
  };
  security: {
    requireApproval: boolean;
    multiLevelApproval: boolean;
    auditTrail: boolean;
    dataEncryption: boolean;
    sessionTimeout: number;
  };
  integration: {
    attendanceSystem: boolean;
    bankingSystem: boolean;
    accountingSystem: boolean;
    hrSystem: boolean;
  };
}

interface PayrollTemplate {
  id: string;
  name: string;
  description: string;
  components: string[];
  isDefault: boolean;
}

const PayrollSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [settings, setSettings] = useState<PayrollSettings>({
    general: {
      companyName: 'TechCorp Solutions',
      payrollCycle: 'monthly',
      payrollStartDate: '1',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      fiscalYearStart: 'April'
    },
    salary: {
      defaultBasicSalaryPercentage: 60,
      allowOvertime: true,
      overtimeRate: 1.5,
      allowAdvances: true,
      maxAdvancePercentage: 50,
      autoCalculateDeductions: true
    },
    deductions: {
      pf: { enabled: true, employeeRate: 12, employerRate: 12 },
      esi: { enabled: true, employeeRate: 0.75, employerRate: 3.25 },
      tax: { enabled: true, autoCalculate: true },
      professionalTax: { enabled: true, amount: 200 }
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      payslipGeneration: true,
      advanceApproval: true,
      payrollProcessing: true
    },
    security: {
      requireApproval: true,
      multiLevelApproval: false,
      auditTrail: true,
      dataEncryption: true,
      sessionTimeout: 30
    },
    integration: {
      attendanceSystem: true,
      bankingSystem: false,
      accountingSystem: false,
      hrSystem: true
    }
  });

  const [payrollTemplates, setPayrollTemplates] = useState<PayrollTemplate[]>([
    {
      id: 'template1',
      name: 'Standard Employee',
      description: 'Basic salary with standard deductions',
      components: ['Basic Salary', 'HRA', 'PF', 'ESI', 'Professional Tax'],
      isDefault: true
    },
    {
      id: 'template2',
      name: 'Senior Management',
      description: 'Executive package with additional benefits',
      components: ['Basic Salary', 'HRA', 'Special Allowance', 'PF', 'Tax', 'Medical Insurance'],
      isDefault: false
    },
    {
      id: 'template3',
      name: 'Contract Worker',
      description: 'Simplified structure for contract employees',
      components: ['Gross Salary', 'TDS'],
      isDefault: false
    }
  ]);

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'salary', name: 'Salary', icon: DollarSign },
    { id: 'deductions', name: 'Deductions', icon: Database },
    { id: 'templates', name: 'Templates', icon: Users },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'integration', name: 'Integration', icon: RefreshCw }
  ];

  const handleSettingChange = (section: keyof PayrollSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleNestedSettingChange = (section: keyof PayrollSettings, subsection: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    // Simulate API call
    console.log('Saving settings:', settings);
    setHasChanges(false);
    setIsEditing(false);
    // Show success message
  };

  const handleResetSettings = () => {
    // Reset to default values
    setHasChanges(false);
    setIsEditing(false);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
          <input
            type="text"
            value={settings.general.companyName}
            onChange={(e) => handleSettingChange('general', 'companyName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payroll Cycle</label>
          <select
            value={settings.general.payrollCycle}
            onChange={(e) => handleSettingChange('general', 'payrollCycle', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="weekly">Weekly</option>
            <option value="bi-weekly">Bi-Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payroll Start Date</label>
          <select
            value={settings.general.payrollStartDate}
            onChange={(e) => handleSettingChange('general', 'payrollStartDate', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Array.from({length: 28}, (_, i) => i + 1).map(day => (
              <option key={day} value={day.toString()}>{day}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select
            value={settings.general.currency}
            onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="INR">Indian Rupee (₹)</option>
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
            <option value="GBP">British Pound (£)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="America/New_York">America/New_York (EST)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
            <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fiscal Year Start</label>
          <select
            value={settings.general.fiscalYearStart}
            onChange={(e) => handleSettingChange('general', 'fiscalYearStart', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="January">January</option>
            <option value="April">April</option>
            <option value="July">July</option>
            <option value="October">October</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSalarySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Default Basic Salary %</label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="40"
              max="80"
              value={settings.salary.defaultBasicSalaryPercentage}
              onChange={(e) => handleSettingChange('salary', 'defaultBasicSalaryPercentage', parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-lg font-semibold text-blue-600 min-w-[60px]">{settings.salary.defaultBasicSalaryPercentage}%</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Overtime Rate Multiplier</label>
          <input
            type="number"
            step="0.1"
            min="1"
            max="3"
            value={settings.salary.overtimeRate}
            onChange={(e) => handleSettingChange('salary', 'overtimeRate', parseFloat(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Advance %</label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="10"
              max="100"
              value={settings.salary.maxAdvancePercentage}
              onChange={(e) => handleSettingChange('salary', 'maxAdvancePercentage', parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-lg font-semibold text-green-600 min-w-[60px]">{settings.salary.maxAdvancePercentage}%</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-medium text-gray-900">Allow Overtime</h4>
            <p className="text-sm text-gray-600">Enable overtime calculation for employees</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.salary.allowOvertime}
              onChange={(e) => handleSettingChange('salary', 'allowOvertime', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-medium text-gray-900">Allow Advances</h4>
            <p className="text-sm text-gray-600">Enable salary advance requests</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.salary.allowAdvances}
              onChange={(e) => handleSettingChange('salary', 'allowAdvances', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-medium text-gray-900">Auto Calculate Deductions</h4>
            <p className="text-sm text-gray-600">Automatically calculate statutory deductions</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.salary.autoCalculateDeductions}
              onChange={(e) => handleSettingChange('salary', 'autoCalculateDeductions', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderDeductionsSettings = () => (
    <div className="space-y-6">
      {/* PF Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Provident Fund (PF)</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.deductions.pf.enabled}
              onChange={(e) => handleNestedSettingChange('deductions', 'pf', 'enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        {settings.deductions.pf.enabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.deductions.pf.employeeRate}
                onChange={(e) => handleNestedSettingChange('deductions', 'pf', 'employeeRate', parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employer Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.deductions.pf.employerRate}
                onChange={(e) => handleNestedSettingChange('deductions', 'pf', 'employerRate', parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* ESI Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Employee State Insurance (ESI)</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.deductions.esi.enabled}
              onChange={(e) => handleNestedSettingChange('deductions', 'esi', 'enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        {settings.deductions.esi.enabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={settings.deductions.esi.employeeRate}
                onChange={(e) => handleNestedSettingChange('deductions', 'esi', 'employeeRate', parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employer Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={settings.deductions.esi.employerRate}
                onChange={(e) => handleNestedSettingChange('deductions', 'esi', 'employerRate', parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Tax Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Income Tax</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.deductions.tax.enabled}
              onChange={(e) => handleNestedSettingChange('deductions', 'tax', 'enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        {settings.deductions.tax.enabled && (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Auto Calculate Tax</h4>
              <p className="text-sm text-gray-600">Automatically calculate income tax based on salary slabs</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.deductions.tax.autoCalculate}
                onChange={(e) => handleNestedSettingChange('deductions', 'tax', 'autoCalculate', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        )}
      </div>

      {/* Professional Tax Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Professional Tax</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.deductions.professionalTax.enabled}
              onChange={(e) => handleNestedSettingChange('deductions', 'professionalTax', 'enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        {settings.deductions.professionalTax.enabled && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Amount (₹)</label>
            <input
              type="number"
              value={settings.deductions.professionalTax.amount}
              onChange={(e) => handleNestedSettingChange('deductions', 'professionalTax', 'amount', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderTemplatesSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Payroll Templates</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Template</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {payrollTemplates.map((template) => (
          <div key={template.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">{template.name}</h4>
              {template.isDefault && (
                <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">Default</span>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-4">{template.description}</p>
            <div className="space-y-2 mb-4">
              <p className="text-sm font-medium text-gray-700">Components:</p>
              <div className="flex flex-wrap gap-1">
                {template.components.map((component, index) => (
                  <span key={index} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                    {component}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1">
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              {!template.isDefault && (
                <button className="bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-3 rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-medium text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-600">Send notifications via email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.emailNotifications}
              onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-medium text-gray-900">SMS Notifications</h4>
            <p className="text-sm text-gray-600">Send notifications via SMS</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.smsNotifications}
              onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-medium text-gray-900">Payslip Generation</h4>
            <p className="text-sm text-gray-600">Notify when payslips are generated</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.payslipGeneration}
              onChange={(e) => handleSettingChange('notifications', 'payslipGeneration', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-medium text-gray-900">Advance Approval</h4>
            <p className="text-sm text-gray-600">Notify when advance requests need approval</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.advanceApproval}
              onChange={(e) => handleSettingChange('notifications', 'advanceApproval', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-medium text-gray-900">Payroll Processing</h4>
            <p className="text-sm text-gray-600">Notify when payroll processing is complete</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.payrollProcessing}
              onChange={(e) => handleSettingChange('notifications', 'payrollProcessing', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-medium text-gray-900">Require Approval</h4>
            <p className="text-sm text-gray-600">Require approval for payroll processing</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.security.requireApproval}
              onChange={(e) => handleSettingChange('security', 'requireApproval', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-medium text-gray-900">Multi-Level Approval</h4>
            <p className="text-sm text-gray-600">Enable multiple approval levels</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.security.multiLevelApproval}
              onChange={(e) => handleSettingChange('security', 'multiLevelApproval', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-medium text-gray-900">Audit Trail</h4>
            <p className="text-sm text-gray-600">Enable comprehensive audit logging</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.security.auditTrail}
              onChange={(e) => handleSettingChange('security', 'auditTrail', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-medium text-gray-900">Data Encryption</h4>
            <p className="text-sm text-gray-600">Encrypt sensitive payroll data</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.security.dataEncryption}
              onChange={(e) => handleSettingChange('security', 'dataEncryption', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
          <select
            value={settings.security.sessionTimeout}
            onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={120}>2 hours</option>
            <option value={240}>4 hours</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-medium text-gray-900">Attendance System</h4>
            <p className="text-sm text-gray-600">Integrate with biometric attendance system</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.integration.attendanceSystem}
              onChange={(e) => handleSettingChange('integration', 'attendanceSystem', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-medium text-gray-900">Banking System</h4>
            <p className="text-sm text-gray-600">Connect with bank for direct salary transfers</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.integration.bankingSystem}
              onChange={(e) => handleSettingChange('integration', 'bankingSystem', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-medium text-gray-900">Accounting System</h4>
            <p className="text-sm text-gray-600">Sync with accounting software</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.integration.accountingSystem}
              onChange={(e) => handleSettingChange('integration', 'accountingSystem', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-medium text-gray-900">HR System</h4>
            <p className="text-sm text-gray-600">Integrate with HR management system</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.integration.hrSystem}
              onChange={(e) => handleSettingChange('integration', 'hrSystem', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings();
      case 'salary': return renderSalarySettings();
      case 'deductions': return renderDeductionsSettings();
      case 'templates': return renderTemplatesSettings();
      case 'notifications': return renderNotificationSettings();
      case 'security': return renderSecuritySettings();
      case 'integration': return renderIntegrationSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/payments')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors group"
          >
            <div className="p-2 rounded-full bg-white shadow-md group-hover:shadow-lg transition-all duration-200">
              <ArrowLeft className="h-5 w-5" />
            </div>
            <span className="font-medium">Back to Payments</span>
          </button>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl mb-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-blue-200 text-sm font-medium">Payroll Settings • {new Date().toLocaleDateString()}</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Payroll Settings</h1>
                <p className="text-xl text-blue-100">Configure your payroll system</p>
              </div>
              <div className="flex items-center space-x-4">
                {hasChanges && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSaveSettings}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={handleResetSettings}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center space-x-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Reset</span>
                    </button>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-blue-100 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                  <Settings className="h-5 w-5" />
                  <span className="font-medium">System Config</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {tabs.find(tab => tab.id === activeTab)?.name} Settings
                </h2>
                <p className="text-gray-600">
                  Configure your {tabs.find(tab => tab.id === activeTab)?.name.toLowerCase()} preferences
                </p>
              </div>
              
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollSettingsPage;