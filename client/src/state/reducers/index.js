import { combineReducers } from "redux";

// import all reducers you want to use
import accountReducer from "./accountReducer"
import userReducer from "./userReducer"
import linkedinReducer from "./linkedinReducer"
import studentReducer from "./studentReducer"

const reducers = combineReducers({
    bank: accountReducer,
    users: userReducer,
    linkedinFilters:linkedinReducer,
    studentInfo:studentReducer

})

export default reducers