import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    shows: [],
};

const showsSlice = createSlice({
    name: 'showsSlice',
    initialState,
    reducers: {
        setShows(state, action) {
            state.shows = action.payload;
        },

        addShow(state, action) {
            state.shows.push(action.payload);
        },
    },
});

export const { setShows, addShow } = showsSlice.actions;
export const showsSliceName = showsSlice.name;
export default showsSlice.reducer;
