import { createSlice } from "@reduxjs/toolkit";
import { exampleUsers } from "../userSchema";

const users = createSlice({
    name: 'users',
    initialState: {
        users: exampleUsers
    },
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload
        },
    }
})
export const { setUsers } = users.actions
export default users.reducer