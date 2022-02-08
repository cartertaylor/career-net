import { combineReducers } from "redux";

// import all reducers you want to use
import accountReducer from "./accountReducer"
import userReducer from "./userReducer"

const reducers = combineReducers({
    bank: accountReducer,
    users: userReducer

})

export default reducers