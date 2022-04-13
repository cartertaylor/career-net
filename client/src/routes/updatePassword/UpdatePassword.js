// Import Router
import { HashRouter as Router, useSearchParams, useParams } from "react-router-dom";

import React, { useEffect, useState  } from 'react';

import Container from 'react-bootstrap/Container';
import {Form, Button, Card} from 'react-bootstrap/';

// Redux
import {useSelector, useDispatch} from "react-redux" // Allows access to store
import {bindActionCreators} from "redux"
import {actionCreators} from "../../state/index"

// Icons
import {AiFillLock} from "react-icons/ai"

// Importing Toast
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UpdatePassword() {

    const [searchParams, setSearchParams] = useSearchParams();

    searchParams.get("dog")
    console.log(searchParams)

        
    
    console.log(searchParams.get('authKey'));
    console.log(searchParams.get('sort'));
    console.log("reee")
    //?sort=name&order=ascending

    // State 
    const [passwords, setPassword] = useState({firstPassword:null, confirmPassword:null})
    const [passwordKey, setPasswordKey] = useState (searchParams.get('authKey'))
    const [keyAuthenticated, setKeyAuthenticated] = useState (false) 
    console.log(passwordKey)

    // Make sure that the state auth key is refreshed every time the parameter changes
    useEffect(() =>
    {        
        setPasswordKey(searchParams.get('authKey'))
    }, [searchParams.get('authKey')])

    // Check to see if the key exists in our database
    useEffect(()=>
    {   
        
        
    }, [passwordKey])

    function handlePasswordSet(e)
    {
        console.log("Set Password")
        // Check to make sure both password fields are filled
        if (passwords.firstPassword == null || passwords.confirmPassword == null
            || passwords.firstPassword == "" || passwords.confirmPassword == "") 
        
        {
            console.log(passwords)
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

        }

        // Check to make sure the auth token exists 

            // Respond with success
            
                // redirect to loging page

            // Respond with failure
    }

    return ( 
        <Container className ="d-flex justify-content-center" style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)'
        }}>


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


                    
                

        </Container>

    );
}

export default UpdatePassword;