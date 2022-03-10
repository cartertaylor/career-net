import React, { useState } from 'react';


// import Bootstrap
// import './node_modules/react-bootstrap/'
import Container from 'react-bootstrap/Container';
import {Form, Button} from 'react-bootstrap/';

// Redux
import {useSelector, useDispatch} from "react-redux" // Allows access to store
import {bindActionCreators} from "redux"
import {actionCreators} from "../../state/index"


// Importing Toast
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import axios from 'axios';

function Login () {

    const dispatch = useDispatch();

    /// Find functions / actions we can use to store data
    const { userLoggedInStatus } = bindActionCreators(
        actionCreators,
        dispatch
    );

    let baseURL = "auth"

    // State Variables
    let [credentials, setLoginCredentials] = useState({userName:null, password:null})

    function checkAuthenticated ()
    {
        
        axios.post("/auth/isAdmin", {message:"Checking if user is authenticated"},
        {
            headers:{
                "x-access-token":localStorage.getItem("token")
            },

        }).then(
            (response) =>
            {
                console.log(response)
                handleToastDisplay(response.data.auth)
                userLoggedInStatus(response.data.auth)
            }
        )
    }

    // Attempts to log in user with given credentials
    function handleLoginSubmit(e)
    {
        e.preventDefault();

        axios
            .post(baseURL + "/login", {
                loginCredentials: credentials,
            })
            .then((response) => {
                // setPost(response.data);
                console.log(response);

                // If user is authenticated, set login variables
                if (response.data.auth)
                {
                    // Store JWT token and set login status to true
                    localStorage.setItem("token", response.data.token)
                    userLoggedInStatus(true)
                }
                
            });
    }

    console.log(credentials)
    
    function handleToastDisplay(serverStatus, message = "none")
    {
        if (serverStatus == true)
        {
            toast.success("Successfully Authenticated")
        }

        else{
            toast.error("Failed to authenticate")
        }
    }

    return (
        
        <Container className ="d-flex justify-content-center">
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


            <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail"  onChange={
                            (e) =>
                            {
                                setLoginCredentials((prevState) => {
                                    return { ...prevState, userName: e.target.value }
                                })
                            }
                        }>

                        <Form.Label>NAU ID</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                            Please provide your NAU email
                        </Form.Text>
                    </Form.Group>
                
                    <Form.Group className="mb-3" controlId="formBasicPassword" 
                        onChange={
                            (e) =>
                            {
                                setLoginCredentials((prevState) => {
                                    return { ...prevState, password: e.target.value }
                                })
                            }
                        }
                    >
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Remember me" />
                    </Form.Group>

                    <Button variant="primary" type="submit" onClick={(e) =>handleLoginSubmit(e)}>
                        Log in
                    </Button>
            </Form>


            <Button onClick={checkAuthenticated}>Check Auth</Button>
        </Container>

        
        
    );

}

export default Login;