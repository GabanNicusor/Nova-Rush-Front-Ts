import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import navReducer from './navSlice';

export const store = configureStore({
    reducer: {
        nav: navReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export function useAppDispatch() {
    return useDispatch<AppDispatch>();
}

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
