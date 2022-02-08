import { combineReducers } from "redux";

// import all reducers you want to use
import accountReducer from "./accountReducer"
import userReducer from "./userReducer"
import linkedinReducer from "./linkedinReducer"

const reducers = combineReducers({
    bank: accountReducer,
    users: userReducer,
    linkedinFilters:linkedinReducer

})

export default reducers