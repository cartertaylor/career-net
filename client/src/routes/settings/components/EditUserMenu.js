import {Form, Button, Row, Col} from "react-bootstrap"

import SearchFilterMenu from "../../../components/SearchFilterMenu";

function EditUserMenu() {

    let filterList = ["Computer Science", "Mechanical Engineering", "Applied Computer Science", "Electrical Engineering", "Cyber Security", "Physics"]
    let exampleEmails = ["cwt48@nau.edu", "bob54@nau.edu", "jww@nau.edu", "wwp@nau.edu"]

    // Grabs the selected majors to filter and returns them in an array of strings
    function handleMajorFilterChange(arrayOfFilteredMajor) {


    }

    // TODO: If ADMIN is selected, create popup dialoge warning submit

    // TODO: If DELETE user is selected, create popup dialoge warning on submit

    // TODO: FETCH USER PERMISSIONS of selected USER, then, fill out the different form defaults with that data 

    return (
        <div style ={{overflow:"scroll", height:"500px"}}>
        <h5>Select User</h5>
        <Form>
            <Row> 
                {/* Change this to be a normal search selector ref: https://semantic-ui.com/modules/search.html*/}
                <SearchFilterMenu customOption = {exampleEmails} handleSearchFilterChange={handleMajorFilterChange} clearButton={false}/>
            </Row>

            {/* TODO: make permissions a conditional based on if a USER has been selected*/}



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

            
            <SearchFilterMenu customOption = {filterList} handleSearchFilterChange={handleMajorFilterChange} clearButton={false} searchTitle="Edit Major Access"/>
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
            
        </Form>
    </div>
    );
}

export default EditUserMenu;