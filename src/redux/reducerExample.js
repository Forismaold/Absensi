import { createSlice } from "@reduxjs/toolkit";

const init = createSlice({
    name: 'example',
    initialState: {
        firstNumber: 1,
        secondNumber: 2,
    },
    reducers: {
        setFirstNumber: (state, action) => {
            state.firstNumber = action.payload
        },
        setSecondNumber: (state, action) => {
            state.secondNumberNumber = action.payload
        }
    }
})
export const {setFirstNumber, setSecondNumber} = init.actions
export default init.reducer