import React, { Component, useState, useEffect } from "react";

// Bootstrap
import {Form, Button, FormControl, Dropdown} from 'react-bootstrap/';

import SearchFilterMenu from "../../../components/SearchFilterMenu";


function StudentSearchBar({ grabState }) {

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
        href=""
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
        &#x25bc;
    </a>
));

    let filterList = ["Computer Science", "Mechanical Engineering", "Exercise Science", "Electrical Engineering"]

    return (
        <div>
            <Dropdown>
                <Dropdown.Toggle
                    as={CustomToggle}
                    id="dropdown-custom-components"
                >
                    Major Filter
                </Dropdown.Toggle>
        
                <Dropdown.Menu as={SearchFilterMenu} customOption = {filterList}>
                    
                </Dropdown.Menu>

            </Dropdown>
        
        </div>
    );
}

export default StudentSearchBar;
