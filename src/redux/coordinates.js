import { createSlice } from "@reduxjs/toolkit";

// Ini adalah data koordinat absensi
// gunakan first dan second untuk membuat area absensi dengan bentuk persegi
// gunakan center untuk memusatkan map layar

const coordinates = createSlice({
    name: 'coordinates',
    initialState: {
        first: [-7.4809139971322525, 110.22876963883765],
        second: [-7.481643174522634, 110.22916754361358],
        center: [-7.481251377867329, 110.22898642833627],
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
