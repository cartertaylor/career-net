import React, { Component, useState, useEffect } from "react";

// Bootstrap
import {Button, Dropdown, Container} from 'react-bootstrap/';

// Other CSS
import "../../../css/main.css";

// Components
import SearchFilterMenu from "../../../components/SearchFilterMenu";
import DateFilterMenu from "../../../components/DateFilterMenu";

function StudentSearchBar({ grabState }) {

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Button 
        href=""
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
        variant="outline-primary"
    >
        {children}
        &#x25bc;
    </Button>
));

    let filterList = ["Computer Science", "Mechanical Engineering", "Exercise Science", "Electrical Engineering"]

    return (
        <div>
                <Dropdown >
                    <Dropdown.Toggle
                        as={CustomToggle}
                        id="dropdown-custom-components"
                        className = "textCustom"
                        
                    >
                        Major Filter
                    </Dropdown.Toggle>
            
                    <Dropdown.Menu as={SearchFilterMenu} customOption = {filterList}>
                        
                    </Dropdown.Menu>

                </Dropdown>
                <Dropdown >
                    <Dropdown.Toggle
                        as={CustomToggle}
                        id="dropdown-custom-components"
                        className = "textCustom"
                        
                    >
                        Date Range
                    </Dropdown.Toggle>
            
                    <Dropdown.Menu as={DateFilterMenu} customOption = {filterList}>
                        
                    </Dropdown.Menu>

                </Dropdown>

        </div>
    );
}

export default StudentSearchBar;
