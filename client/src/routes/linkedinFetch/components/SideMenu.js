import {React, useState} from "react";



import {Button, Offcanvas, Dropdown } from "react-bootstrap"

import SearchFilterMenu from "../../../components/SearchFilterMenu";
import DateFilterMenu from "../../../components/DateFilterMenu";

export default function SideMenu({currentMenu})
{

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    console.log(currentMenu)

    // This list will depend on the users available users
    let filterList = ["Computer Science", "Mechanical Engineering", "Applied Computer Science", "Electrical Engineering", "Cyber Security", "Physics"]

    function handleSearchFilterChange()
    {
        console.log("Update State of the currently selected Majors")
    }

    function grabDateRanges()
    {
        console.log("Update the current state of the grad date ranges")
    }

    function chooseMenu(currentMenu)
    {
        let menuJSX = null
        console.log("hey")
        console.log(currentMenu)

        if (currentMenu == "major")
        {
            menuJSX = (<SearchFilterMenu customOption = {filterList} handleSearchFilterChange= {handleSearchFilterChange}/>)
        }
        else if (currentMenu == "Graduation Year")
        {
            menuJSX = (<DateFilterMenu grabDateRanges= {grabDateRanges}/>)

        }

        return menuJSX
    }

    return (
        <div>
            <Button variant="primary" onClick={handleShow}>
                Launch
            </Button>

            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Filter and Sort</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>{chooseMenu(currentMenu)}</Offcanvas.Body>
            </Offcanvas>
        </div>
    );
}