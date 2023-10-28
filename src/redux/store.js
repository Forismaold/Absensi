import { configureStore } from '@reduxjs/toolkit';
import coordinates from './coordinates';

export default configureStore({
    reducer: {
        coordinates: coordinates
    }
});
