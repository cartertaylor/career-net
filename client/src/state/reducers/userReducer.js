
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
            console.log("Checking user admin")
            console.log(action.payload)
            return {...state, userAdmin:action.payload, userCanUploadNewData:true};

        // Checks login status of user
        case "checkUserStatus":
            return {...state, userLoggedIn:action.payload}; // Returns (true or false) 

        case "setUserName":
            console.log("setting user")
            return {...state, userName:action.payload}; // Returns (true or false) 

        case "grabUserPermissions":
            console.log("USER PERMISSIONS!")
            console.log(action.payload)
            // Find out if user can upload data

            // Set both that value, and the major acces array
            return {...state, majorPermissions:action.payload.majorPermissions, userCanUploadNewData:action.payload.userCanUploadNewData}

        // Set on user login
        case "setUserAdmin":
            return {...state, userAdmin:action.payload}

        default:
            return state
    }
}

export default reducer;