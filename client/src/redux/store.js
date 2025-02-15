import { createStore, applyMiddleware, combineReducers } from "redux";
import  thunk  from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { userReducer } from "../redux/UserReducer";
import voteReducer from "../redux/voteReducer";

const rootReducer = combineReducers({
  user: userReducer,
  vote: voteReducer,
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
