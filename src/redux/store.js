import { configureStore } from '@reduxjs/toolkit';
import coordinates from './coordinates';
import users from './users';
import source from './source';
import map from './map';

export default configureStore({
    reducer: {
        source: source,
        coordinates: coordinates,
        users: users,
        map: map
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: {
            ignoredPaths: ['map.focusOnLocation'],
            ignoredActions: ['map/setFocusOnLocation'],
        },
    }),

});
