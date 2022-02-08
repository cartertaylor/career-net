
// state is initial state of reducer
// action contains (function, payload). Payload being the new value you are setting
const initialState = [];

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

        default:
            return state
    }
}

export default reducer;