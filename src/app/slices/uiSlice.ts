import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

interface UIState {
  drawerOpen: boolean;
  rightPanelOpen: boolean;
  modalOpen: boolean;
  currentModal: string | null;
  notifications: Notification[];
  notificationsPaneOpen: boolean;
  searchOpen: boolean;
  loading: boolean;
  theme: 'light' | 'dark';
}

const initialState: UIState = {
  drawerOpen: true,
  rightPanelOpen: false,
  modalOpen: false,
  currentModal: null,
  notifications: [],
  notificationsPaneOpen: false,
  searchOpen: false,
  loading: false,
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDrawer: (state) => {
      state.drawerOpen = !state.drawerOpen;
    },
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.drawerOpen = action.payload;
    },
    toggleRightPanel: (state) => {
      state.rightPanelOpen = !state.rightPanelOpen;
    },
    setRightPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.rightPanelOpen = action.payload;
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.modalOpen = true;
      state.currentModal = action.payload;
    },
    closeModal: (state) => {
      state.modalOpen = false;
      state.currentModal = null;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
        read: false,
      };
      state.notifications.unshift(notification);
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    toggleNotificationsPane: (state) => {
      state.notificationsPaneOpen = !state.notificationsPaneOpen;
    },
    setNotificationsPaneOpen: (state, action: PayloadAction<boolean>) => {
      state.notificationsPaneOpen = action.payload;
    },
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen;
    },
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.searchOpen = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
  },
});

export const {
  toggleDrawer,
  setDrawerOpen,
  toggleRightPanel,
  setRightPanelOpen,
  openModal,
  closeModal,
  addNotification,
  markNotificationRead,
  removeNotification,
  toggleNotificationsPane,
  setNotificationsPaneOpen,
  toggleSearch,
  setSearchOpen,
  setLoading,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer;