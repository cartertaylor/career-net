import React, {useState, useEffect } from "react";

// Bootstrap
import {Button, Dropdown, Row, Col} from 'react-bootstrap/';

// Other CSS
import mainStyles from "../../../css/main.css";
import "../../../css/main.css";
// Components
import SearchFilterMenu from "../../../components/SearchFilterMenu";
import DateFilterMenu from "../../../components/DateFilterMenu";
import axios from "axios";



function StudentSearchBar({ grabDateRanges, handleSearchFilterChange }) {

    // State for search array
    let [userMajorAccessArray, setMajorAccess] = useState([])
    
    // Runs on each rerender
    useEffect(()=>
    {
        getPermissions()
    
        
    }, [])


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
            // style={{width:"1%"}}
        >
            {children}
            &#x25bc;
        </Button>
    ));
    



    function getPermissions()
        {
            axios
            .post("/users/current/permissions", 
                {
                    message:"Grabbing current user major permissions"
                },
                {
                headers: {
                    "x-access-token":localStorage.getItem("token")
                },

                
            })
            .then((response) => {
                // setPost(response.data);
                console.log(
                    response.data
                );

                setMajorAccess(response.data.majorPermissions)
            });
    }

    let filterList = ["Computer Science", "Mechanical Engineering", "Applied Computer Science", "Electrical Engineering", "Cyber Security", "Physics", "Exercise Science"]
    console.log(userMajorAccessArray)
    return (
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
                        
                                <Dropdown.Menu 
                                    
                                    as={SearchFilterMenu}
                                    // className = "dropdown-menu-search"
                                    customOption = {userMajorAccessArray}
                                    handleSearchFilterChange = {handleSearchFilterChange}>
                                    
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
                                
                                <Dropdown.Menu as={DateFilterMenu}

                                    customOption = {filterList}
                                    id="dropdown-custom-components" 
                                    grabDateRanges={grabDateRanges}>

                                </Dropdown.Menu>

                            </Dropdown>
                        </Col>

                        
                        
                    </Row>
                

        
    );
}

export default StudentSearchBar;
