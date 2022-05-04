import React, { useState } from 'react';


// import Bootstrap
import Container from 'react-bootstrap/Container';
import {Form, Button, Card} from 'react-bootstrap/';

// Redux
import {useDispatch} from "react-redux" // Allows access to store
import {bindActionCreators} from "redux"
import {actionCreators} from "../../state/index"

// Icons
import {AiFillLock} from "react-icons/ai"


// Importing Toast
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ModalPopup from '../../components/ModalPopup';


import axios from 'axios';

function Login () {

       // State for Modal
    const [modalShow, setModalShow] = useState(false);

    const dispatch = useDispatch();

    /// Find functions / actions we can use to store data
    const { userLoggedInStatus, setUserName, grabUserPermissions, setUserAdmin} = bindActionCreators(
        actionCreators,
        dispatch
    );

    let baseURL = "auth"

    // State Variables
    let [credentials, setLoginCredentials] = useState({userName:null, password:null})
    let [resetEmail, setResetEmail] = useState({resetEmail:""})

        

    function checkAuthenticated ()
    {
        
        axios.post("/api/auth/isAdmin", {message:"Checking if user is authenticated"},
        {
            headers:{
                "x-access-token":localStorage.getItem("token")
            },

        }).then(
            (response) =>
            {
                
                handleToastDisplay(response.data.auth)
                userLoggedInStatus(response.data.auth)
            }
        )
    }

    // Attempts to send a change-password link to the email provided if it exists
    function handleChangePasswordSubmit()
    {

        
        {   
            // Reach out to backend, and attempt to send an email (only if the email exists)
            axios.post("/api/auth/sendResetEmail", {message:"Attempt to reset password", userEmail:resetEmail},
                ).then(
                    (response) =>
                    {
                        
                         // Put Toast notification for email sent
                        toast.info("Reset email sent to:  " + resetEmail.resetEmail + ". Please access the URL included in that e-mail to reset your password.")
                    }
                )

            // Reset the email state to an empty string
            setResetEmail((prevState) => {
                return {
                    ...prevState,
                    resetEmail: "",
                };
            });
        }
        
    }

    function checkEmailBox()
    {

        if (resetEmail.resetEmail.length <1)
        {
            toast.warning("Please enter an email into the email box")
            return false
        }
        else if (!resetEmail.resetEmail.includes("@"))
        {
            toast.warning("Please enter an email into the email box")   
            return false
        }

        return true


    }

    // Attempts to log in user with given credentials
    function handleLoginSubmit(e)
    {
        e.preventDefault();
        toast.promise(
        axios
            .post("api/" + baseURL + "/login", {
                loginCredentials: credentials,
            })
            .then((response) => {
                // setPost(response.data);
                

                // If user is authenticated, set login variables
                if (response.data.auth)
                {
                    
                    
                    // Store JWT token and set login status to true
                    localStorage.setItem("token", response.data.token)
                    userLoggedInStatus(true)
                    setUserName(response.data.userName)
                    setUserAdmin(response.data.isAdmin)
                    grabUserPermissions()
                }
                // Failed to login
                else{
                    handleToastDisplay(false)
                }
                
            }),
            {
                pending: "Verifying credentials",
                success: "Success!",
            }
        )
    }

    
    
    function handleToastDisplay(serverStatus, message = "none")
    {
        if (serverStatus == true)
        {
            toast.success("Successfully Authenticated")
        }

        else{
            toast.error("Failed to authenticate with the provided username and password")
        }
    }

    console.log("This is the login page!")

    return (
        <div>

            {/* <ToastContainer /> */}
            <ToastContainer
                    position="top-center"
                    autoClose={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    transition={Slide}
                />
            <Container
                className="d-flex justify-content-center"
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                

                <ModalPopup
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    modalText={{
                        title: "Enter in email to change password",
                        subTitle: null,
                        body: null,
                    }}
                    modalComponent= {
                    <Form>
                        <Form.Group
                            className="mb-3"
                            controlId="formBasicEmail"
                            onChange={(e) => {
                                setResetEmail((prevState) => {
                                    return {
                                        ...prevState,
                                        resetEmail: e.target.value,
                                    };
                                });
                            }}
                        >
                            <Form.Label className = "form-text">Please enter the e-mail address registered to your account, and then select Submit.
                                An e-mail will be sent to that address containing a link to reset your password.</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                            />
                            <Form.Label className = "form-text">IMPORTANT: Make sure to check your spam folder for the email if you can't find it in your inbox</Form.Label>
                            {/* Warn to make sure they check their spam*/}
                        </Form.Group>
                    </Form>
                    }
                    buttonLabel = {"Submit"}
                    successSubmit={handleChangePasswordSubmit}
                    checkValid={checkEmailBox}
                />

                <Card style={{ width: "25rem", height: "23rem" }}>
                    <Card.Header className="text-center">
                        <h3>
                            <AiFillLock className="mb-1 me-1" />
                            Login
                        </h3>
                    </Card.Header>

                    <Card.Body>
                        <Form>
                            <Form.Group
                                className="mb-3"
                                controlId="formBasicEmail"
                                onChange={(e) => {
                                    setLoginCredentials((prevState) => {
                                        return {
                                            ...prevState,
                                            userName: e.target.value,
                                        };
                                    });
                                }}
                            >
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                />
                                <Form.Text className="text-muted">
                                    Please provide your NAU email associated with your account
                                </Form.Text>
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="formBasicPassword"
                                onChange={(e) => {
                                    setLoginCredentials((prevState) => {
                                        return {
                                            ...prevState,
                                            password: e.target.value,
                                        };
                                    });
                                }}
                            >
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                />
                                <Form.Text className="" onClick={(e) => {setModalShow(true)
                                    e.preventDefault();}}>
                                    <a href="">Forgot Password?</a>
                                </Form.Text>
                            </Form.Group>

                            {/* <Form.Group
                                className=""
                                controlId="formBasicCheckbox"
                            >
                                <Form.Check type="checkbox" label="Remember me" />
                            </Form.Group> */}

                            <Button
                                className = "mb-4"
                                variant="primary"
                                type="submit"
                                onClick={(e) => handleLoginSubmit(e)}
                            >
                                Log in
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );

}

export default Login;
