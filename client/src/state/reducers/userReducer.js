
// state is initial state of reducer
// action contains (function, payload). Payload being the new value you are setting
const initialState = {
    userLoggedIn:null,
    userAdmin:null,
    userName:null,
}; // TODO: Make this an object, and set a key for user logged in and admin status

const reducer = (
    state = initialState,
    action
) => {
    switch (action.type) {
        // return 
        case "userAdded":
            return [...state, action.payload];

        // return state with the user removed
        case "userRemoved":
            return 1;

        case "checkUserAdmin":
            return {...state, userAdmin:action.payload};

        // Checks login status of user
        case "checkUserStatus":
            return {...state, userLoggedIn:action.payload}; // Returns (true or false) 

        case "setUserName":
            return {...state, userName:action.payload}; // Returns (true or false) 

        default:
            return state
    }
}

export default reducer;