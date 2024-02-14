import { createSlice } from "@reduxjs/toolkit";
import { getDecryptObjectLocalStorage } from "../utils";

const source = createSlice({
    name: 'source',
    initialState: {
        account: getDecryptObjectLocalStorage('account') || null,
        isWatchPosition: false,
        showAbsence: false,
        showMap: true,
        absensi: null,
        status: null,
    },
    reducers: {
        setAccount: (state, action) => {
            state.account = action.payload
        },
        refreshAccount: (state, action) => {
            state.account = getDecryptObjectLocalStorage('account')
        },
        setIsWatchPosition: (state, action) => {
            state.isWatchPosition = action.payload
        },
        setShowAbsenceForm: (state, action) => {
            state.showAbsenceForm = action.payload
        },
        toggleShowAbsence: (state, action) => {
            state.showAbsence = !state.showAbsenceForm
        },
        toggleShowMap: (state, action) => {
            state.showMap = action.payload || !state.showMap
        },
        setShowMap: (state, action) => {
            state.showMap = action.payload
        },
        setAbsensi: (state, action) => {
            state.absensi = action.payload
            state.status = action.payload?.users?.find(item => item._id === state.account?._id) || undefined
        }
    }
})
export const { setAccount, refreshAccount, setStatus, setRiwayats, setAbsensi, setAdminRiwayats, toggleShowAbsenceForm, setIsWatchPosition, toggleShowMap, setShowAbsence, setShowMap } = source.actions
export default source.reducer