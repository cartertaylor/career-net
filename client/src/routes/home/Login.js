import React, { useState } from 'react';


// import Bootstrap
// import './node_modules/react-bootstrap/'
import Container from 'react-bootstrap/Container';
import {Form, Button} from 'react-bootstrap/';

// Importing Toast
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';

function Login () {

    let baseURL = "auth"

    let [credentials, setLoginCredentials] = useState({userName:null, password:null})

    let [userAuthorized, setUserAuthorized] = useState(false)

    console.log("User Logged in: " + userAuthorized)

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
            }
        )
    }

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

                if (response.data.auth)
                {
                    setUserAuthorized(true);
                    localStorage.setItem("token", response.data.token)
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