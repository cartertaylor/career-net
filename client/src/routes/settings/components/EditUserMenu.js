import React  from 'react';

import {Form, Button, Row, Col, Modal} from "react-bootstrap"

import SearchFilterMenu from "../../../components/SearchFilterMenu";
import SearchBarAuto from "../../../components/SearchBarAuto";
import ModalPopup from "../../../components/ModalPopup";


import {useState, useEffect} from "react"
import axios from "axios";

// ENV variables for user roles
const userAdminValue = parseInt( process.env.REACT_APP_USER_ADMIN_VALUE);
const userFacultyValue = parseInt(process.env.REACT_APP_USER_FACULTY_VALUE);

function EditUserMenu({handleToastDisplay}) {

    let filterList = ["Computer Science", "Mechanical Engineering", "Applied Computer Science", "Electrical Engineering", "Cyber Security", "Physics"]


    // State for selected filters
    let [permissions, setPermissions] = useState(
        {
            firstName:null,
            lastName:null,
            email:null,
            userType:null,
            canUploadNewData:false,
            majorAccess:[],
            initialUserType:null, // Gets the original value the user has. The ones above is for updates
            initialMajorAccess:[],
            userId:null
            

        }
        
    )

    // State for Modal
    const [modalShow, setModalShow] = useState(false);
    const [userModalShow, setUserModalShow] = useState(false);
    
    // Function handles when the current user submits changes to the user permissions they are editing 
    function handleEditPermissionSubmit()
    {
        // Check to make sure all fields are filled out.  (make sure userType != Choose)
        console.log("Success Submit")
            // Report back if they are missing a field

        // Bring up modal to check and see if they really want to edit users permissions
        console.log(permissions)
        
        // Update the data for the user being edited
        axios
        .post("/api/users/edit/permissions", 
            {
                newPermissions:permissions
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
            handleToastDisplay(response.data.status, response.data.message)

        });

        

    }


    function handleUserDelete()
    {
        console.log("Deleting user")
        // Check to make sure all fields are filled out.  (make sure userType != Choose)

        // Bring up modal to check and see if they really want to edit users permissions
        console.log(permissions)
        
        // Update the data for the user being edited
        axios
        .post("/api/users/delete", 
            {
                usersId:permissions.userId,
                firstName: permissions.firstName,
                lastName: permissions.lastName
                
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
            handleToastDisplay(response.data.status, response.data.message)

        });
        // Send request to delete user
    }


    // Function asks user if they are sure they want to make the user an Admin. 
    function handleUserTypeChange ()
    {
        
    }


    // Grabs the selected majors to filter and returns them in an array of strings
    function handleMajorFilterChange(arrayOfFilteredMajor) 
        {

            console.log(arrayOfFilteredMajor)
            setPermissions( (prevState => 
                (
                    {...prevState, majorAccess:arrayOfFilteredMajor}
                )
                    
            ))
        }

    
    
    
    // TODO: If ADMIN is selected, create popup dialoge warning submit

    // TODO: If DELETE user is selected, create popup dialoge warning on submit
    

    
    function handleUserClick (userSelected)
    {   
        console.log(userSelected)
        
        let searchUser = {
            firstName:userSelected.title.split(" ")[0],
            lastName:userSelected.title.split(" ")[1],
            email:userSelected.description
        }

        axios
        .post("/api/users/search/permissions", 
            {
                searchedUser:searchUser
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
            

            
            setPermissions( (prevState => 
                (
                    {...prevState, ...response.data.userPermissions}
                )
                    
            ))

        });
    
    }

    // Use Effect runs afer state changes
    useEffect(()=>
    {
        console.log("user searched")
    
        
    }, [permissions])

    console.log(permissions)

    function getPermissionBasedOnId(permissionId)
    {

        console.log(permissionId)

        if (permissionId == userAdminValue)
        {
            return "Admin"
        }
        else
        {
            return "Normal Faculty"
        }
    }

    return (
        <div style ={{overflow:"scroll", height:"500px"}}>

        <ModalPopup
                show={modalShow}
                onHide={() => setModalShow(false)}
                modalText= {{title:"Edit User Submission", subTitle:"Confirmation", body:"Are you sure you would like to alter this users permisisions?"}}
                successSubmit = {handleEditPermissionSubmit}
                
        />
        <ModalPopup
                show={userModalShow}
                onHide={() => setUserModalShow(false)}
                modalText= {{title:"Delete User Confirmation", subTitle:null, body:"Are you sure you would like to delete this user? Once they are deleted,  will no longer have access to data."}}
                successSubmit = {handleUserDelete}
                buttonVariant="danger"
                
        />
        <h5>Select User</h5>
        <Form>
            <Row className = "m-2"> 
                {/* Change this to be a normal search selector ref: https://semantic-ui.com/modules/search.html*/}
                {/* <SearchFilterMenu customOption = {exampleEmails} handleSearchFilterChange={handleMajorFilterChange} clearButton={false}/> */}
                
                {/* <Col></Col> */}
                <SearchBarAuto as = {Col} routeURL="/api/users/search" handleUserClick={
                    
                    handleUserClick
                }
                />
                {/* <Col></Col> */}
            </Row>

            {permissions.firstName == null ? null : 

            <div>
                <h5>Permissions</h5>
                {permissions.initialUserType == userFacultyValue? 
                <div>
                <Row>
                    <Form.Group as={Col} controlId="formGridState">
                        <Form.Label>User Type</Form.Label>
                        <Form.Select value={permissions.userType}
                        onChange={
                            (e) =>
                            {   
                                console.log("LET GO BOY")
                                setPermissions((prevState) => {
                                    return { ...prevState, userType: e.target.value }
                                })
                            }
                        }>
                            
                            <option>Normal Faculty</option>
                            <option>Admin</option>
                        </Form.Select>
                    </Form.Group>
                
                    <Form.Group as={Col} controlId="formGridState">
                        <Form.Label>Upload New Data</Form.Label>
                        <Form.Check
                            type="switch"
                            id="custom-switch"
                            label="Check for user to have ability to upload new student data"
                            defaultChecked={permissions.canUploadNewData}
                            checked={permissions.canUploadNewData}
                            className="text-muted"
                            onChange={
                                (e) =>
                                {
                                    console.log(permissions.canUploadNewData )
                                    setPermissions((prevState) => {
                                        return { ...prevState, canUploadNewData:!permissions.canUploadNewData }
                                    })
                                }
                            }
                        />
                    </Form.Group>
                </Row>

                <SearchFilterMenu customOption = {filterList} handleSearchFilterChange={handleMajorFilterChange}
                    clearButton={false}
                    searchTitle="Edit Major Access"
                    initialFilters ={permissions.initialMajorAccess}/>

                    {/* {permissions.userType != "Admin" ? <SearchFilterMenu customOption = {filterList} handleSearchFilterChange={handleMajorFilterChange} clearButton={false} autoFocus={false} searchTitle="Choose Major Access"/> : null} */}

                <hr/>
                
                
        <>
            
        </>

                <Row className="mb-1">
                    <Col>
                        <Button  variant="primary" size="lg" type="" onClick={()=>setModalShow(true)}>
                            Save Changes
                        </Button>
                    </Col>
                    <Col>
                        <Button variant="danger" size="lg" type="" onClick={()=>setUserModalShow(true)} >
                            Remove User
                        </Button>
                    </Col>
                </Row>
                </div>
                : null}

                {
                    permissions.userType == userAdminValue ?
                    <div>
                        <hr/>
                        <p>This user is also an admin and has admin privileges</p>
                    </div>
                : null}
            
            </div>
}
        </Form>
    </div>
    );
}

export default EditUserMenu;