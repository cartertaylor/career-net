
// state is initial state of reducer
// action contains (function, payload). Payload being the new value you are setting
const initialState = {
        selectedFilters:
        {
            dateRanges: { startDate: undefined, endDate: undefined },
            filteredMajors: null,
            lastTimeUpdatedRange: { startDate: undefined, endDate: undefined },
        }
}

const reducer = (
    state = initialState,
    action
) => {
    switch (action.type) {
        // return 
        case "filterChanged":
            return {...state, selectedFilters:action.payload};

        default:
            return state
    }
}

export default reducer;