import { createSlice } from "@reduxjs/toolkit";

const coordinates = createSlice({
    name: 'coordinates',
    initialState: {
        first: [-7.473522264390467, 110.2273099602978],
        second: [-7.474273526975641, 110.22664174529595],
        center: [-7.473859226144764, 110.22701972496937],
        user: null,
    },
    reducers: {
        setUserCoordinate: (state, action) => {
            state.user = action.payload
        },
    }
})
export const { setUserCoordinate } = coordinates.actions
export default coordinates.reducer
