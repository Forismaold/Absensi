import { configureStore } from '@reduxjs/toolkit';
import example from './reducerExample'

export default configureStore({
    reducer: {
        example: example
    }
});
