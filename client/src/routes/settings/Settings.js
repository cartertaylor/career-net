import {Card, Container, ListGroup, Row, Col, Button} from "react-bootstrap"
import {useState} from "react"
import React  from 'react';
// Import other Components
import AddUserMenu from "./components/AddUserMenu";
import EditUserMenu from "./components/EditUserMenu";

// Importing Toast
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Settings() {

    const [show, setShow] = useState(false);
    let [currentMenu, setCurrentMenu] = useState(null);
    

    function showSideMenu(e)
    {
        console.log(e.target)
        console.log(e.target.innerText)

        setCurrentMenu(e.target.innerText)
    }

    // Function that displays a toast depending on passed in server status
    function handleToastDisplay(serverStatus, message = null)
    {   

        if (serverStatus == true || serverStatus == "Success")
        {
            toast.success(message)
        }

        else{
            toast.error(message)
        }
    }


    function showCurrentMenu()
    {

        let showMenu = (
            <p>Please Select a menu option on the left</p>
        )

        if (currentMenu == "Add User")
        {
            showMenu = (
                <Card>
                    <Card.Header className="text-center"><h3>Add User</h3> </Card.Header>
                    <Card.Body>
                        <AddUserMenu className="dropdown-menu-search" handleToastDisplay={handleToastDisplay}/>
                    </Card.Body>
                </Card>
            );
        }

        else if (currentMenu == "Edit User")
        {
            showMenu = (
                <Card>
                    <Card.Header className="text-center"><h3>Edit User</h3> </Card.Header>
                    <Card.Body>
                        <EditUserMenu className="dropdown-menu-search" handleToastDisplay={handleToastDisplay}/>
                    </Card.Body>
                </Card>
            );
        }

        return showMenu
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

            <Container>
                <h1 className="text-center">Admin Settings</h1>
                <hr className="mb-2"/>
                
                <Row>

                    <Col md={12} sm={3} >
                        {/* Empty offset Col */}
                    </Col>

                    <Col className="mt-4">
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
                    
                        
                    
                    <Col sm className="mb-3 mt-4">
                        
                        {showCurrentMenu()}
                        
                    </Col>

                </Row>
            </Container>
        </div>
    );
}

export default Settings;
