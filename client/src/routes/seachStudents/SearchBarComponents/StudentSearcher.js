import React, { useState, useEffect } from "react";

// Bootstrap
import {Button, Dropdown, Container, Row, Col} from 'react-bootstrap/';

// Other CSS
import mainStyles from "../../../css/main.css";

// Components
import SearchFilterMenu from "../../../components/SearchFilterMenu";
import DateFilterMenu from "../../../components/DateFilterMenu";

function StudentSearchBar({ grabState, grabDateRanges }) {


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

    let filterList = ["Computer Science", "Mechanical Engineering", "Applied Computer Science", "Electrical Engineering", "Cyber Security", "Physics"]

    return (
        <div>
                <Container className=  "mb-3">
                    <Row>
                        <Col>
                            <Dropdown >
                                <Dropdown.Toggle
                                    as={CustomToggle}
                                    id="dropdown-custom-components"
                                    className = "textCustom"
                                    
                                >
                                    Major Filter
                                </Dropdown.Toggle>
                        
                                <Dropdown.Menu as={SearchFilterMenu} className = "dropdown-menu-search" customOption = {filterList} style = {mainStyles}>
                                    
                                </Dropdown.Menu>
                        
                            </Dropdown>
                        </Col>
                        <Col>
                            <Dropdown >
                                <Dropdown.Toggle
                                    as={CustomToggle}
                                    id="dropdown-custom-components"
                                    className = "textCustom"
                                    
                                >
                                    Date Range
                                </Dropdown.Toggle>
                        
                                <Dropdown.Menu as={DateFilterMenu} customOption = {filterList} grabDateRanges={grabDateRanges}>

                                </Dropdown.Menu>

                            </Dropdown>
                        </Col>
                        
                    </Row>
                </Container>

        </div>
    );
}

export default StudentSearchBar;
