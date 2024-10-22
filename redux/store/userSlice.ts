import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    id: string;
    username: string | null;
    profileImage: any | null;
    followers: string[];
    following: string[];
    about: string;
}

interface UserState {
    currentUser: User | null;
    users: User[];
}

const initialState: UserState = {
    currentUser: null,
    users: [],
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser: (state, action: PayloadAction<User | null>) => {
            state.currentUser = action.payload;
        },
        updateCurrentUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.currentUser) {
                state.currentUser = {...state.currentUser, ...action.payload};
            }
        },
        setUsers: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload;
        },
        followUser: (state, action: PayloadAction<string>) => {
            const targetUserId = action.payload;
            const targetUser = state.users.find(user => user.id === targetUserId);

            if (state.currentUser && targetUser && !state.currentUser.following.includes(targetUserId)) {
                // Güncel kullanıcının following listesine ekleme
                state.currentUser.following.push(targetUserId);
                // Hedef kullanıcının followers listesine ekleme
                targetUser.followers.push(state.currentUser.id);
            }
        },
        unfollowUser: (state, action: PayloadAction<string>) => {
            const targetUserId = action.payload;
            const targetUser = state.users.find(user => user.id === targetUserId);

            if (state.currentUser && targetUser) {
                // Güncel kullanıcının following listesinden çıkarma
                state.currentUser.following = state.currentUser.following.filter(
                    (id) => id !== targetUserId
                );
                // Hedef kullanıcının followers listesinden çıkarma
                targetUser.followers = targetUser.followers.filter(
                    (id) => id !== state.currentUser?.id
                );
            }
        },
    },
});

export const { setCurrentUser, updateCurrentUser, setUsers, followUser, unfollowUser } = userSlice.actions;
export default userSlice.reducer;
