import { createSlice } from "@reduxjs/toolkit";
import { getDecryptObjectLocalStorage } from "../utils";

const source = createSlice({
    name: 'source',
    initialState: {
        account: getDecryptObjectLocalStorage('account') || null,
        status: null,
        absensi: null,
        adminRiwayats: null,
        riwayats: null,
        isWatchPosition: false,
        showAbsenceForm: false
    },
    reducers: {
        setAccount: (state, action) => {
            state.account = action.payload
        },
        refreshAccount: (state, action) => {
            state.account = getDecryptObjectLocalStorage('account')
        },
        setStatus: (state, action) => {
            state.status = action.payload || null
        },
        setAdminRiwayats: (state, action) => {
            state.adminRiwayats = action.payload || null
        },
        setRiwayats: (state, action) => {
            state.riwayats = action.payload || null
        },
        setAbsensi: (state, action) => {
            state.absensi = action.payload || null
        },
        setIsWatchPosition: (state, action) => {
            state.isWatchPosition = action.payload || !state.isWatchPosition
        },
        toggleShowAbsenceForm: (state, action) => {
            state.showAbsenceForm = action.payload || !state.showAbsenceForm
        },
    }
})
export const { setAccount, refreshAccount, setStatus, setRiwayats, setAbsensi, setAdminRiwayats, toggleShowAbsenceForm, setIsWatchPosition } = source.actions
export default source.reducer