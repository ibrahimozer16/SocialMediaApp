import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface Story {
    id: string;
    image: any;
    username?: string;
}

interface StoryState {
    stories: Story[];
    currentStory: any;
}

const initialState: StoryState = {
    stories: [],
    currentStory: null,
};

const storySlice = createSlice({
    name: 'story',
    initialState,
    reducers: {
        setCurrentStory: (state, action: PayloadAction<Story>) => {
            state.currentStory = action.payload;
        },
        setStories: (state, action: PayloadAction<Story[]>) => {
            state.stories = action.payload;
        },
        addStory: (state, action: PayloadAction<Story>) => {
            state.stories.unshift(action.payload);
        }
    },
});

export const { setCurrentStory, setStories, addStory } = storySlice.actions;
export default storySlice.reducer;
