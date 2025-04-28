import { configureStore } from '@reduxjs/toolkit';
import documentsReducer from './slices/documentsSlice';
import adherentsReducer from './slices/adherentsSlice';
import empruntsReducer from './slices/empruntsSlice';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    documents: documentsReducer,
    adherents: adherentsReducer,
    emprunts: empruntsReducer,
    auth: authReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
