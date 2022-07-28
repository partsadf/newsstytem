import { createStore, combineReducers } from "redux";

import { CollapsedReducer } from "./reducers/CollapsedReducer";
import { LoadingReducer } from "./reducers/LoadingReducer";

const reducers = combineReducers({
	CollapsedReducer,
	LoadingReducer,
});
const store = createStore(reducers);
export default store;
