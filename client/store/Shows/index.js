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

        addShows(state, action) {
            state.shows.push(action.payload);
        },
    },
});

export const { setShows } = showsSlice.actions;
export const showsSliceName = showsSlice.name;
export default showsSlice.reducer;
