import {Form, Button, Row, Col} from "react-bootstrap"

import SearchFilterMenu from "../../../components/SearchFilterMenu";
import SearchBarAuto from "../../../components/SearchBarAuto";
import {useState, useEffect} from "react"
import axios from "axios";

function EditUserMenu() {

    let filterList = ["Computer Science", "Mechanical Engineering", "Applied Computer Science", "Electrical Engineering", "Cyber Security", "Physics"]

    // Grabs the selected majors to filter and returns them in an array of strings
    function handleMajorFilterChange(arrayOfFilteredMajor) 
        {

        }
    
    // TODO: If ADMIN is selected, create popup dialoge warning submit

    // TODO: If DELETE user is selected, create popup dialoge warning on submit
    
    // State for selected filters
    let [permissions, setPermissions] = useState(
        {
            firstName:null,
            lastName:null,
            email:null,
            userType:null,
            canUploadNewData:false,
            majorAccess:[]

        }
        
    )
    
    function handleUserClick (userSelected)
    {   
        console.log(userSelected)

        let searchUser = {
            firstName:userSelected.title.split(" ")[0],
            lastName:userSelected.title.split(" ")[1],
            email:userSelected.description
        }

        axios
        .post("/users/search/permissions", 
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
        
        // Retreive users permissions 
        // axios
        //     .post("/users/search/permissions", 
        //         {
        //             newUserData:newUserData
        //         },
        //         {
        //         headers: {
        //             "x-access-token":localStorage.getItem("token")
        //         },
                
        //     })
        //     .then((response) => {
        //         // setPost(response.data);
        //         console.log(response);
                
        //     });
        
        
    }, [permissions])

    console.log(permissions)

    return (
        <div style ={{overflow:"scroll", height:"500px"}}>
        <h5>Select User</h5>
        <Form>
            <Row className = "m-2"> 
                {/* Change this to be a normal search selector ref: https://semantic-ui.com/modules/search.html*/}
                {/* <SearchFilterMenu customOption = {exampleEmails} handleSearchFilterChange={handleMajorFilterChange} clearButton={false}/> */}
                
                {/* <Col></Col> */}
                <SearchBarAuto as = {Col} routeURL="/users/search" handleUserClick={
                    
                    handleUserClick
                    
                    // (userSelected)=> setPermissions((prevState)=> 
                    // ({...prevState,
                    //     firstName:userSelected.title.split(" ")[0],
                    //     lastName:userSelected.title.split(" ")[1],
                    //     email:userSelected.description
                    // })) 
                }
                />
                {/* <Col></Col> */}
            </Row>

            {permissions.firstName == null ? null : 

            <div>
                <h5>Permissions</h5>
                {permissions.userType == 2 ? 
                <div>
                <Row>
                    <Form.Group as={Col} controlId="formGridState">
                        <Form.Label>User Type</Form.Label>
                        <Form.Select defaultValue="Normal Faculty">
                            <option>Choose...</option>
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
                            className="text-muted"
                        />
                    </Form.Group>
                </Row>

                
                
                
                <SearchFilterMenu customOption = {filterList} handleSearchFilterChange={handleMajorFilterChange}
                    clearButton={false}
                    searchTitle="Edit Major Access"
                    initialFilters ={permissions.majorAccess}/>
                <hr/>
                <Row>
                    <Col>
                        <Button  variant="primary" size="lg" type="submit">
                            Save Changes
                        </Button>
                    </Col>
                    <Col>
                        <Button variant="danger" size="lg" type="submit">
                            Remove User
                        </Button>
                    </Col>
                </Row>
                </div>
                : null}

                {
                    permissions.userType == 1 ?
                    <div>
                        <hr/>
                        <p>This user is also an admin and has admin privledges</p>
                    </div>
                : null}
            
            </div>
}
        </Form>
    </div>
    );
}

export default EditUserMenu;