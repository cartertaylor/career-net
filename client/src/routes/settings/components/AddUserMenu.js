import {Form, Button, Row, Col} from "react-bootstrap"

import { useState } from "react";
import axios from "axios";

import SearchFilterMenu from "../../../components/SearchFilterMenu";

function AddUserMenu({handleToastDisplay}) {

    let filterList = ["Computer Science", "Mechanical Engineering", "Applied Computer Science", "Electrical Engineering", "Cyber Security", "Physics"]

    let [newUserData, setNewUserData] = useState({
        email:null,
        firstName:null,
        lastName:null,
        role:null,
        majorAccess:null,
        uploadNewData:false,
    })

    

    // Grabs the selected majors to filter and returns them in an array of strings
    function handleMajorFilterChange(arrayOfFilteredMajor) {
        // Store array of majors in state
        setNewUserData((prevState ) => {return {...prevState, majorAccess:arrayOfFilteredMajor}})
    }
    
    function handleUserAdd(e)
    {
        e.preventDefault();

        // TODO: Make sure that all the forms are entered
        axios
            .post("/users/create", 
                {
                    newUserData:newUserData
                },
                {
                headers: {
                    "x-access-token":localStorage.getItem("token")
                },
                
            })
            .then((response) => {
                // setPost(response.data);
                console.log(response);
                console.log(response.data)
                handleToastDisplay(response.data.status, response.data.message)

            });
    }

    console.log(newUserData)

    // TODO: If ADMIN is selected, create popup dialoge warning on submit

    // Yo whats up
    return (
        <div style ={{overflow:"auto", height:"500px"}}>
            <h5>User Information</h5>
            <Form>
                <Row>
                    <Form.Group
                        as={Col}
                        className="mb-3"
                        controlId="formBasicName"
                        onChange={
                            (e) =>
                            {
                                setNewUserData((prevState) => {
                                    return { ...prevState, firstName: e.target.value }
                                })
                            }
                        }
                    >
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            type="name"
                            placeholder="Enter First Name"
                        />
                    </Form.Group>

                    <Form.Group
                        as={Col}
                        className="mb-3"
                        controlId="formBasicPassword"
                        onChange={
                            (e) =>
                            {
                                setNewUserData((prevState) => {
                                    return { ...prevState, lastName: e.target.value }
                                })
                            }
                        }
                    >
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="name"
                            placeholder="Enter Last Name"
                        />
                    </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="formBasicEmail"
                    onChange={
                        (e) =>
                        {
                            setNewUserData((prevState) => {
                                return { ...prevState, email: e.target.value }
                            })
                        }
                    }
                >
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter NAU email" />
                </Form.Group>

                <h5>Permissions</h5>
                <Row>
                    <Form.Group as={Col} controlId="formGridState"
                        
                    >
                        <Form.Label>User Type</Form.Label>
                        <Form.Select defaultValue="Choose..." 
                            onChange={
                                (e) =>
                                {   
                                    console.log("LET GO BOY")
                                    setNewUserData((prevState) => {
                                        return { ...prevState, role: e.target.value }
                                    })
                                }
                            }
                        >
                            <option>Choose...</option>
                            <option>Normal Faculty</option>
                            <option>Admin</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridState"
                        
                    >
                        <Form.Label>Upload New Data</Form.Label>
                        <Form.Check
                            type="switch"
                            id="custom-switch"
                            label="Check for user to have ability to upload new student data"
                            defaultChecked={false}
                            className="text-muted"
                            onClick={
                                (e) =>
                                {
                                    setNewUserData((prevState) => {
                                        return { ...prevState, uploadNewData:!newUserData.uploadNewData }
                                    })
                                }
                            }
                            
                        />
                    </Form.Group>
                </Row>

                {newUserData.role != "Admin" ? <SearchFilterMenu customOption = {filterList} handleSearchFilterChange={handleMajorFilterChange} clearButton={false} searchTitle="Choose Major Access"/> : null}
                
                <hr/>
                <Button variant="primary" size="lg" type="submit" onClick={handleUserAdd}>
                    Add User
                </Button>
            </Form>
        </div>
    );
}

export default AddUserMenu;