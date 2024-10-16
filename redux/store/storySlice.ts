import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StoryState {
    currentStory: any;
}

const initialState: StoryState = {
    currentStory: null,
};

const storySlice = createSlice({
    name: 'story',
    initialState,
    reducers: {
        setCurrentStory: (state, action: PayloadAction<any>) => {
            state.currentStory = action.payload;
        },
    },
});

export const { setCurrentStory } = storySlice.actions;
export default storySlice.reducer;
