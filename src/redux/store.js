import { configureStore } from '@reduxjs/toolkit';
import coordinates from './coordinates';
import users from './users';

export default configureStore({
    reducer: {
        coordinates: coordinates,
        users: users
    }
});
