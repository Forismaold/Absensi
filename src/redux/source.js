import { createSlice } from "@reduxjs/toolkit";
import { getDecryptObjectLocalStorage } from "../utils";

const source = createSlice({
    name: 'source',
    initialState: {
        account: getDecryptObjectLocalStorage('account') || null,
        isWatchPosition: false,
        showAbsenceForm: false,
        showMap: true
    },
    reducers: {
        setAccount: (state, action) => {
            state.account = action.payload
        },
        refreshAccount: (state, action) => {
            state.account = getDecryptObjectLocalStorage('account')
        },
        setIsWatchPosition: (state, action) => {
            state.isWatchPosition = action.payload || !state.isWatchPosition
        },
        setShowAbsenceForm: (state, action) => {
            state.showAbsenceForm = action.payload
        },
        toggleShowAbsenceForm: (state, action) => {
            state.showAbsenceForm = !state.showAbsenceForm
        },
        toggleShowMap: (state, action) => {
            state.showMap = action.payload || !state.showMap
        },
        setShowMap: (state, action) => {
            state.showMap = action.payload
        }
    }
})
export const { setAccount, refreshAccount, setStatus, setRiwayats, setAbsensi, setAdminRiwayats, toggleShowAbsenceForm, setIsWatchPosition, toggleShowMap, setShowAbsenceForm, setShowMap } = source.actions
export default source.reducer