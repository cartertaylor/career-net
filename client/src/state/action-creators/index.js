export const depositMoney = (amount) => {
    return (dispatch) => {
        dispatch({
            type: "deposit",
            payload: amount
        });
    }
}

export const withdrawMoney = (amount) => {
    return (dispatch) => {
        dispatch({
            type: "withdraw",
            payload: amount
        });
    }
}

export const addUser = (userData) => {

    return (dispatch) => {
        dispatch({
            type: "userAdded",
            payload: userData
        });
    }
}

export const removeUser = (userData) => {
    
    return (dispatch) => {
        dispatch({
            type: "userRemoved",
            payload: userData
        });
    }
}

export const addLinkedinFilter = (userData) => {
    
    return (dispatch) => {
        dispatch({
            type: "filterChanged",
            payload: userData
        });
    }
}

export const addClickedStudent = (studentData) => {
    
    return (dispatch) => {
        dispatch({
            type: "clickedStudentProfile",
            payload: studentData
        });
    }
}

export const setUserAdmin = (isAdmin) => {
    return (dispatch) => {
        dispatch({
            type: "checkUserAdmin",
            payload: isAdmin
        });
    }
}


export const userLoggedInStatus = (isLoggedIn) => {
    return (dispatch) => {
        dispatch({
            type: "checkUserStatus",
            payload: isLoggedIn
        });
    }
}