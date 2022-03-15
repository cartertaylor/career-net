
// state is initial state of reducer
// action contains (function, payload). Payload being the new value you are setting
const initialState = {
        selectedFilters:
        {
            gradDateRanges: { startDate: undefined, endDate: undefined },
            filteredMajors: null,
            lastTimeUpdatedRange: { startDate: undefined, endDate: undefined },
            fetchOnlyUserAddedData:false
        }
}

const reducer = (
    state = initialState,
    action
) => {
    console.log("jose guy")
    console.log(action.payload)
    switch (action.type) {
        // return 
        
        case "filterChanged":
            console.log("IN Linkedin change")
            console.log(action.payload.fetchOnlyUserAddedData)
            return action.payload
            return {...state.selectedFilters, fetchDataUploadedByCurrentUser:action.payload};
        
        default:
            return state
    }
}

export default reducer;