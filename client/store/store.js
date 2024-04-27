import { configureStore } from "@reduxjs/toolkit";
import usersReducer, {usersSliceName} from "./Users";
import showsReducer, {showsSliceName} from "./Shows";
import venuesReducer, {venuesSliceName} from "./Venues";


export const store = configureStore({
    reducer: {
        [usersSliceName]: usersReducer,
        [showsSliceName]: showsReducer,
        [venuesSliceName]: venuesReducer,
    },
})