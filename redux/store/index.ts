import { configureStore } from '@reduxjs/toolkit';
import storyReducer from './storySlice';
import userReducer from './userSlice';
import postReducer from './postSlice';

const store = configureStore({
    reducer: {
        story: storyReducer,
        user: userReducer,
        post: postReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
