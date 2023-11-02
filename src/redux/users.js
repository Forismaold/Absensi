import { createSlice } from "@reduxjs/toolkit";

const users = createSlice({
    name: 'users',
    initialState: {
        users: []
    },
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload
        },
    }
})
export const { setUsers } = users.actions
export default users.reducer