import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    users: [],
};

const usersSlice = createSlice({
    name: 'usersSlice',
    initialState,
    reducers: {
        setUsers(state, action) {
            state.users = action.payload;
        },
    },
});

export const {setUsers} = usersSlice.actions;
export const usersSliceName = usersSlice.name;
export default usersSlice.reducer;