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
        isFetchLocation: false,
        proMode: false
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
        setShowAbsence: (state, action) => {
            state.showAbsence = action.payload
        },
        toggleShowAbsence: (state, action) => {
            state.showAbsence = !state.showAbsence
        },
        toggleShowMap: (state, action) => {
            state.showMap = action.payload || !state.showMap
        },
        setShowMap: (state, action) => {
            state.showMap = action.payload
        },
        clearAbsensi: (state, action) => {
            state.absensi = null
            state.status = null
        },
        setAbsensi: (state, action) => {
            try {
                let absence = action.payload
                if (!absence?.coordinates?.first.length) absence.coordinates.first = [-7.482044510981448, 110.22200388577714]
                if (!absence?.coordinates?.second.length) absence.coordinates.second = [-7.482209927696517, 110.22228020994946]
                state.absensi = absence
                const userTicket = absence.tickets?.find(ticket => ticket?.user?._id === state.account?._id) || null
                if (userTicket) {
                    state.showMap = false
                } else {
                    state.showMap = true
                }
                state.status = userTicket
            } catch (error) {
                console.log(error);
            }
        },
        setIsFetchLocation: (state, action) => {
            state.isFetchLocation = action.payload
        },
        setProMode: (state, action) => {
            state.proMode = action.payload
        }
    }
})
export const { setAccount, refreshAccount, setStatus, setRiwayats, setAbsensi, setAdminRiwayats, toggleShowAbsence, setIsWatchPosition, toggleShowMap, setShowAbsence, setShowMap, clearAbsensi, setIsFetchLocation, setProMode } = source.actions
export default source.reducer