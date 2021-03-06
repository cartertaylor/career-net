import {React, useState} from "react";


import { useSelector } from "react-redux";

import {Button, Offcanvas, Dropdown, ListGroup } from "react-bootstrap"

import SearchFilterMenu from "../../../components/SearchFilterMenu";
import DateFilterMenu from "../../../components/DateFilterMenu";
import CalendarFilterMenu from "../../../components/CalendarFilterMenu";
import { filter } from "lodash";


export default function SideMenu({...props})
{

    // props received from parent component
    let currentMenu = props.currentMenu
    let handleSearchFilterChange = props.handleSearchFilterChange
    let grabDateRanges = props.handleDateRangeChange
    let handleLastTimeUpdatedRange = props.handleLastTimeUpdatedRange
    let parentState = props.parentState
    let filterMenu =props.filterMenu

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // This list will depend on the users available users
    // let filterList = ["Computer Science", "Mechanical Engineering", "Applied Computer Science", "Electrical Engineering", "Cyber Security", "Physics"]

    const filterList = useSelector(state => state.users.majorPermissions)
    console.log(filterList)

    function chooseMenu(currentMenu)
    {
        let menuJSX = null
        console.log(currentMenu)

        if (currentMenu == "Major")
        {
            menuJSX = (filterMenu)
        }
        else if (currentMenu == "Graduation Year")
        {
            menuJSX = (<DateFilterMenu grabDateRanges= {grabDateRanges}/>)
        }
        else if (currentMenu == "Student Upload Range")
        {
            menuJSX = (<CalendarFilterMenu handleLastTimeUpdatedRange = {handleLastTimeUpdatedRange}/>)
        }

        return menuJSX
    }



    return (
        <div>
            <ListGroup.Item action variant="" onClick={handleShow}>
                {(currentMenu)}
            </ListGroup.Item>

            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{currentMenu}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {chooseMenu(currentMenu)}
                    
                </Offcanvas.Body>
                
            </Offcanvas>
        </div>
    );
}