import { createSlice } from "@reduxjs/toolkit";

const map = createSlice({
    name: 'map',
    initialState: {
        focusOnLocation: null // ini function fokus ke map
    },
    reducers: {
        setFocusOnLocation: (state, action) => {
            state.focusOnLocation = action.payload
        }
    }
})
export const { setFocusOnLocation } = map.actions
export default map.reducer
