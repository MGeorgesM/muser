import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    connectedUsers: [],
    feedUsers: [],
};

const usersSlice = createSlice({
    name: 'usersSlice',
    initialState,
    reducers: {
        setConnectUsers(state, action) {
            state.connectedUsers = action.payload;
        },
        setFeedUsers(state, action) {
            state.feedUsers = action.payload;
        },
        addConnectedUser(state, action) {
            const userId = action.payload;
            const userIndex = state.feedUsers.findIndex((user) => user.id === userId);
            if (userIndex !== -1) {
                state.connectedUsers.push(state.feedUsers[userIndex]);
                state.feedUsers.splice(userIndex, 1);
            }
        },
    },
});

export const { setConnectUsers, setFeedUsers } = usersSlice.actions;
export const usersSliceName = usersSlice.name;
export default usersSlice.reducer;
