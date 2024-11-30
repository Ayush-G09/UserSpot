import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import reducer from "./reducer";

// Configure persistence
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

// Create store with persisted reducer
const store = createStore(persistedReducer);

// Create persistor
const persistor = persistStore(store);

// Export RootState type for use with useSelector
export type RootState = ReturnType<typeof store.getState>;

export { store, persistor };
