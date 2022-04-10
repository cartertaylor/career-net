import axios from "axios";

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
    

    if (userData)
    console.log("LETS GO BOY")
    console.log(userData)
    
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

export const setUserName = (logInName) => {
    return (dispatch) => {
        dispatch({
            type: "setUserName",
            payload: logInName
        });
    }
}

// Example using a post request to dispatch data
export const grabUserPermissions = () => {

    return dispatch => { //return function
        return axios
                .post("api/users/current/permissions", 
                    {
                        message:"Grabbing current user major permissions"
                    },
                    {
                    headers: {
                        "x-access-token":localStorage.getItem("token")
                    },                
                })
                .then((response) => {
                    // setPost(response.data);
                    console.log(
                        response.data
                    );

                        dispatch({
                            type: "grabUserPermissions",
                            payload: response.data
                        });
                    
                });
        }

}

export const setUserPermissions = (adminStatus) => {
    return (dispatch) => {
        dispatch({
            type: "setUserAdmin",
            payload: adminStatus
        });
    }
    
}


export const setReduxGraphData = (graphData) => {
    return (dispatch) => {
        dispatch({
            type: "updateGraph",
            payload: graphData
        });
    }
    
}





