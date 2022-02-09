import {Form, Button, Row, Col} from "react-bootstrap"

import SearchFilterMenu from "../../../components/SearchFilterMenu";

function AddUserMenu() {

    let filterList = ["Computer Science", "Mechanical Engineering", "Applied Computer Science", "Electrical Engineering", "Cyber Security", "Physics"]

      // Grabs the selected majors to filter and returns them in an array of strings
    function handleMajorFilterChange(arrayOfFilteredMajor) {
        console.log(arrayOfFilteredMajor == false)

        console.log("yo")
        
    }

    // TODO: If ADMIN is selected, create popup dialoge warning on submit

    // Yo whats up
    return (
        <div style ={{overflow:"scroll", height:"500px"}}>
            <h5>User Information</h5>
            <Form>
                <Row>
                    <Form.Group
                        as={Col}
                        className="mb-3"
                        controlId="formBasicName"
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
                    >
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="name"
                            placeholder="Enter Last Name"
                        />
                    </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter NAU email" />
                </Form.Group>
                <h5>Permissions</h5>
                <Row>
                    <Form.Group as={Col} controlId="formGridState">
                        <Form.Label>User Type</Form.Label>
                        <Form.Select defaultValue="Choose...">
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
                            defaultChecked={false}
                            className="text-muted"
                        />
                    </Form.Group>
                </Row>

                
                
                <SearchFilterMenu customOption = {filterList} handleSearchFilterChange={handleMajorFilterChange} clearButton={false} searchTitle="Choose Major Access"/>
                <hr/>
                <Button variant="primary" size="lg" type="submit">
                    Add User
                </Button>
            </Form>
        </div>
    );
}

export default AddUserMenu;