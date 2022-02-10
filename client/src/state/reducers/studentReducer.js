
// state is initial state of reducer
// action contains (function, payload). Payload being the new value you are setting
const initialState = 
    { studentInfo: {
        firstName: null,
        id: null,
        lastName: null,
        newInfo: {
            degree: null,
            schoolYear: null,
            workExperience: null
        }
    }
};


const reducer = (
    state = initialState,
    action
    ) => {
        console.log(action.payload)
        console.log("STUDENT REDUCER")
    switch (action.type) {
        
        // return 
        case "clickedStudentProfile":
            // return (action.payload)
            return {...state, studentInfo:action.payload};

        // return state with the user removed
        case "studentRemoved":
            return 1;

        default:
            return state
    }
}

export default reducer;