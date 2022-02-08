import {Card, Container, ListGroup, Row, Col, Button} from "react-bootstrap"
import {useState} from "react"

// Import other Components
import AddUserMenu from "./components/AddUserMenu";
import EditUserMenu from "./components/EditUserMenu";


function Settings() {

    const [show, setShow] = useState(false);
    let [currentMenu, setCurrentMenu] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    

    function showSideMenu(e)
    {
        console.log(e.target)
        console.log(e.target.innerText)

        setCurrentMenu(e.target.innerText)
    }

    function showCurrentMenu()
    {

        let showMenu = (
            null
        )

        if (currentMenu == "Add User")
        {
            showMenu = (
                <Card>
                    <Card.Header><h3>Add User</h3> </Card.Header>
                    <Card.Body>
                        <AddUserMenu className="dropdown-menu-search"/>
                    </Card.Body>
                </Card>
            );
        }

        else if (currentMenu == "Edit User")
        {
            showMenu = <Card.Header><h3>Edit User</h3></Card.Header>
        }

        return showMenu
    }

    return (
        <div>
            

            <Container>
                <h1 className="text-center">Admin Settings</h1>
                <hr className="mb-4"/>
                
                <Row>
                    <Col>
                        <Card style={{ width: '18rem', textAlign:"center" }} className= "">
                            <Card.Header><h3>Settings</h3></Card.Header>
                            <ListGroup variant="flush">

                            <ListGroup.Item action variant="" onClick={(e )=> showSideMenu(e)}>
                                Add User
                            </ListGroup.Item>

                            <ListGroup.Item action variant="" onClick={(e )=> showSideMenu(e)}>
                                Edit User
                            </ListGroup.Item>

                                {/* <SideMenu currentMenu = "Major" handleSearchFilterChange = {handleSearchFilterChange} parentState = {parentState.filteredMajors} filterMenu = {filterMenu}/>
                                <SideMenu currentMenu = "Student Last Updated" handleLastTimeUpdatedRange = {handleLastTimeUpdatedRange}/>
                                <SideMenu currentMenu = "Graduation Year" handleDateRangeChange = {handleDateRangeChange}/>   */}

                            </ListGroup >
                            
                            {/* <SideMenu currentMenu = "Graduation Year"/> */}
                            
                            
                        </Card>
                    </Col>
                    
                    <Col className="mb-3">
                        
                        {showCurrentMenu()}
                        
                    </Col>

                </Row>
            </Container>
        </div>
    );
}

export default Settings;
