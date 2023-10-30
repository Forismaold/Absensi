import { configureStore } from '@reduxjs/toolkit';
import coordinates from './coordinates';
import users from './users';
import source from './source';

export default configureStore({
    reducer: {
        source: source,
        coordinates: coordinates,
        users: users
    }
});
