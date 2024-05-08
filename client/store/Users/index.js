import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    connectedUsers: [],
    feedUsers: [],
    aiMatches: [],
};

const usersSlice = createSlice({
    name: 'usersSlice',
    initialState,
    reducers: {
        setConnectedUsers(state, action) {
            state.connectedUsers = action.payload;
        },
        setFeedUsers(state, action) {
            state.feedUsers = action.payload;
        },
        setAiMatches(state, action) {
            state.aiMatches = action.payload;
        },
        addNewConnection(state, action) {
            console.log('Adding new connection:', action.payload)
            const userId = action.payload;
            const userIndex = state.feedUsers.findIndex((user) => user.id == userId);
            if (userIndex !== -1) {
                state.connectedUsers.push(state.feedUsers[userIndex]);
                state.feedUsers.splice(userIndex, 1);
            }

            console.log('New connected users:', state.connectedUsers);
        },
    },
});

export const { setConnectedUsers, setFeedUsers, setAiMatches, addNewConnection } = usersSlice.actions;
export const usersSliceName = usersSlice.name;
export default usersSlice.reducer;
