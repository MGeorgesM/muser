import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedVenue: null,
    venues: [],
};

const venuesSlice = createSlice({
    name: 'venues',
    initialState,
    reducers: {
        setVenues(state, action) {
            state.venues = action.payload;
        },
        setSelectedVenue(state, action) {
            state.selectedVenue = action.payload;
        },
    },
});

export const { setVenues, setSelectedVenue } = venuesSlice.actions;
export const venuesSliceName = venuesSlice.name;
export default venuesSlice.reducer;