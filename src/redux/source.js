import { createSlice } from "@reduxjs/toolkit";
import { getDecryptObjectLocalStorage } from "../utils";

const source = createSlice({
    name: 'source',
    initialState: {
        account: getDecryptObjectLocalStorage('account') || null,
        status: null,
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
        setRiwayats: (state, action) => {
            state.riwayats = action.payload || null
        },
    }
})
export const { setAccount, refreshAccount, setStatus, setRiwayats } = source.actions
export default source.reducer