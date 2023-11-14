import { createSlice } from "@reduxjs/toolkit";
import { getDecryptObjectLocalStorage } from "../utils";

const source = createSlice({
    name: 'source',
    initialState: {
        account: getDecryptObjectLocalStorage('account') || null,
        status: null,
        absensi: null,
        adminRiwayats: null,
        riwayats: null
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
    }
})
export const { setAccount, refreshAccount, setStatus, setRiwayats, setAbsensi, setAdminRiwayats } = source.actions
export default source.reducer