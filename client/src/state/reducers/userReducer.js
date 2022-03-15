
// state is initial state of reducer
// action contains (function, payload). Payload being the new value you are setting
const initialState = {
    userLoggedIn:null,
    userAdmin:null,
    userName:null,
    majorPermissions:[],
    userCanUploadNewData:null
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

        case "grabUserPermissions":
            console.log("USER PERMISSIONS!")
            console.log(action.payload)
            // Find out if user can upload data

            // Set both that value, and the major acces array

            return {...state, majorPermissions:action.payload.majorPermissions, userCanUploadNewData:action.payload.userCanUploadNewData}
        default:
            return state
    }
}

export default reducer;