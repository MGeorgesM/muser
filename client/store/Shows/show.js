import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    shows: [],
};

const showsSlice = createSlice({
    name: 'shows',
    initialState,
    reducers: {
        setShows(state, action) {
            state.shows = action.payload;
        },
    },
});

export const { setShows } = showsSlice.actions;
export const showsSliceName = showsSlice.name;
export default showsSlice.reducer;
