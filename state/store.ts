import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import navReducer from './navSlice';

// 1. Configure the store
export const store = configureStore({
  reducer: {
    nav: navReducer,
  },
});

// 2. Define Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 3. Define and Export Hooks (Only once!)
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
