import { configureStore } from "@reduxjs/toolkit";
import usersSliceReducer, {usersSliceName} from "./Users";
import showsSliceReducer, {showsSliceName} from "./Shows";
import venuesSliceReducer, {venuesSliceName} from "./Venues";


export const store = configureStore({
    reducer: {
        [usersSliceName]: usersSliceReducer,
        [showsSliceName]: showsSliceReducer,
        [venuesSliceName]: venuesSliceReducer,
    },
})