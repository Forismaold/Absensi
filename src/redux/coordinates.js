import { createSlice } from "@reduxjs/toolkit";

const coordinates = createSlice({
    name: 'coordinates',
    initialState: {
        first: [-7.4822300,  110.2220029],
        second: [-7.4820399, 110.2222523],
        center: [-7.4820399, 110.2222523],
        user: [0, 0],
    },
    reducers: {
        setUserCoordinate: (state, action) => {
            state.user = action.payload
        },
    }
})
export const { setUserCoordinate } = coordinates.actions
export default coordinates.reducer