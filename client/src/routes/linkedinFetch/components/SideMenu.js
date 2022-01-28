import {React, useState} from "react";



import {Button, Offcanvas, Dropdown, ListGroup } from "react-bootstrap"

import SearchFilterMenu from "../../../components/SearchFilterMenu";
import DateFilterMenu from "../../../components/DateFilterMenu";

export default function SideMenu({...props})
{

    // props received from parent component
    let currentMenu = props.currentMenu
    let handleSearchFilterChange = props.handleSearchFilterChange
    let grabDateRanges = props.handleDateRangeChange

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // This list will depend on the users available users
    let filterList = ["Computer Science", "Mechanical Engineering", "Applied Computer Science", "Electrical Engineering", "Cyber Security", "Physics"]

    function chooseMenu(currentMenu)
    {
        let menuJSX = null
        console.log(currentMenu)

        if (currentMenu == "Major")
        {
            menuJSX = (<SearchFilterMenu customOption = {filterList} handleSearchFilterChange = {handleSearchFilterChange}/>)
        }
        else if (currentMenu == "Graduation Year")
        {
            menuJSX = (<DateFilterMenu grabDateRanges= {grabDateRanges}/>)

        }

        return menuJSX
    }



    return (
        <div>
            <ListGroup.Item action variant="primary" onClick={handleShow}>
                {(currentMenu)}
            </ListGroup.Item>

            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Filter and Sort</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {chooseMenu(currentMenu)}
                    
                </Offcanvas.Body>
                
            </Offcanvas>
        </div>
    );
}