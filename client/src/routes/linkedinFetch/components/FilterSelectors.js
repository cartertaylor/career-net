import {React, useState} from "react";

// Bootstrap
import {Card, ListGroup, Button} from "react-bootstrap"

// Other Components
import SideMenu from "./SideMenu";




// Functions holds filter options for Linkedin data fecthing
export default function FilterSelectors()
{
    const [showSideMenu, setShowSideMenu] = useState(false)
    const [clickedFilter, setClickedFilter] =useState(undefined)

    function handleSideMenuClose()
    {
        // set menue to close 
    }

    // Will update based on which menu button is clicked
    function handleMenuClick(e)
    {   console.log(e.target.value)
        console.log("menu button click")
    }

    
    return(
    <Card style={{ width: '18rem', }} className= "">
        <Card.Header><h3>Linkedin Filter</h3></Card.Header>
        <ListGroup variant="flush">
            <ListGroup.Item ><Button variant="primary" onClick = {(e) => handleMenuClick(e)}>Major -></Button></ListGroup.Item>
            <ListGroup.Item>Upload Date range</ListGroup.Item>
            <ListGroup.Item>Graduation Year</ListGroup.Item>
        </ListGroup >
        <SideMenu currentMenu = "major"/>
        <SideMenu currentMenu = "Graduation Year"/>
        
        
    </Card>
    )
}