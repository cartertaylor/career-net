// Import Router
import { HashRouter as Router, useSearchParams, useParams } from "react-router-dom";

import React, { useEffect, useState  } from 'react';

import Container from 'react-bootstrap/Container';
import {Form, Button, Card} from 'react-bootstrap/';

import axios from "axios";

// Redux
import {useSelector, useDispatch} from "react-redux" // Allows access to store
import {bindActionCreators} from "redux"
import {actionCreators} from "../../state/index"

// Icons
import {AiFillLock} from "react-icons/ai"

// Importing Toast
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ENV variables for current URL
const homePageUrl = parseInt(process.env.REACT_URL);

function UpdatePassword() {

    const [searchParams, setSearchParams] = useSearchParams();

    searchParams.get("dog")

    //?sort=name&order=ascending
    // Redux
    const dispatch = useDispatch();

    // Access store functions
    const { setNewPasswordAuthenticationKeyValid } = bindActionCreators( // If a user is authenticated, we store the truth of that here
        actionCreators,
        dispatch
    );
    
    // Store variables
    let keyIsValid = useSelector((state) => state.users.providedKeyValid);
    


    // State 
    const [passwords, setPassword] = useState({firstPassword:null, confirmPassword:null})
    const [passwordKey, setPasswordKey] = useState (searchParams.get('authKey'))
    const [keyAuthenticated, setKeyAuthenticated] = useState (false) 

    // Make sure that the state auth key is refreshed every time the parameter changes
    useEffect(() =>
    {        
        setPasswordKey(searchParams.get('authKey'))
    }, [searchParams.get('authKey')])

    // Check to see if the key exists in our database
    useEffect(()=>
    {   
        setNewPasswordAuthenticationKeyValid(passwordKey)
    }, [passwordKey])

    function handlePasswordSet(e)
    {
        console.log("Set Password")
        // Check to make sure both password fields are filled
        if (passwords.firstPassword == null || passwords.confirmPassword == null
            || passwords.firstPassword == "" || passwords.confirmPassword == "") 
        
        {
            toast.warning("Please sure you fill in both password fields")
        }

        // Check to make sure both password fields are the same 
        else if (passwords.firstPassword != passwords.confirmPassword )
        {
            toast.warning("The passwords provided do not match. Please make sure they match.")
        }

        // Check password length
        else if ( !(passwords.firstPassword.length > 8))
        {
            toast.warning("Make sure the legnth of your password is 8 characters or more")
        }
        
        // Send request to reset password 
        else
        {
            axios.post("/api/auth/newPassword", {message:"Checking for ", providedKey: passwordKey, passwords:passwords},
            {
                headers:{
                    "x-access-token":localStorage.getItem("token")
                },

            }).then(
                (response) =>
                {

                    if (response.data.updated)
                    {
                        toast.success("Password updated, please go back to the login page")
                        // Redirect to home page
                        window.location.href = homePageUrl
                    }
                    else{
                        toast.warning("Invalid key provided")
                    }
                }
                )
        }

        // Check to make sure the auth token exists 

            // Respond with success
            
                // redirect to loging page

            // Respond with failure
    }

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

            {keyIsValid ? <Container className ="d-flex justify-content-center" style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)'
            }}>


                
                

                <Card style={{ width: '25rem' }}>
                <Card.Header className ="text-center"><h3><AiFillLock/>Update Password</h3></Card.Header>
                
                    <Card.Body>
                        
                        <Form>
                                <Form.Group className="mb-3" controlId="formBasicPassword" 
                                    onChange={
                                        (e) =>
                                        {
                                            setPassword((prevState) => {
                                                return { ...prevState, firstPassword: e.target.value }
                                            })
                                        }
                                    }
                                >
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" />
                                </Form.Group>
                                
                                <Form.Group className="mb-3" controlId="formBasicPassword" 
                                    onChange={
                                        (e) =>
                                        {
                                            setPassword((prevState) => {
                                                return { ...prevState, confirmPassword: e.target.value }
                                            })
                                        }
                                    }
                                >
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control type="password" placeholder="Confirm Password" />
                                </Form.Group>
                                

                                <Button variant="primary" type="submit" onClick={(e) =>handlePasswordSet(e)}>
                                    Set Password
                                </Button>
                        </Form>
                    </Card.Body>
                </Card>



            </Container> :
                <Container>
                    <h1 className="text-center mb-2">ERROR, NO KEY FOUND</h1>
                    <h4 className="text-center">Talk to the administrator to create an account</h4>
                </Container>}
            
        </div>

    );
}

export default UpdatePassword;