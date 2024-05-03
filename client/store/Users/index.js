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
            const newUser = action.payload;
            state.connectedUsers.push(newUser);
            state.feedUsers = state.feedUsers.filter((user) => user.id !== newUser.id);
        }
    },
});

export const { setConnectUsers, setFeedUsers } = usersSlice.actions;
export const usersSliceName = usersSlice.name;
export default usersSlice.reducer;
