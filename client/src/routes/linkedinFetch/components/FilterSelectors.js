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
    const [selectedFilters, setSelectedFilters] = useState({
        dateRanges: {startDate:undefined, endDate:undefined},
        filteredMajors: null
        
    })

    // Grab necessary majors available to user from cookies 

    // Grabs the selected majors to filter and returns them in an array of strings 
    function handleSearchFilterChange(arrayOfFilteredMajor)
    {
        setSelectedFilters(prevState => {return {...prevState, filteredMajors:arrayOfFilteredMajor}})
    }

    console.log(selectedFilters.dateRanges)

    // Grabs the selected year ranges from the filter menu 
    function handleDateRangeChange(ranges)
    {
        setSelectedFilters((prevState => { return {...prevState, dateRanges:ranges}}))
    }


    
    return(
    <Card style={{ width: '18rem', }} className= "">
        <Card.Header><h3>Linkedin Filter</h3></Card.Header>
        <ListGroup variant="flush">

            <SideMenu currentMenu = "Major" handleSearchFilterChange = {handleSearchFilterChange} />
            <SideMenu currentMenu = "Student Last Updated" handleDateRangeChange = {handleDateRangeChange}/>
            <SideMenu currentMenu = "Graduation Year" handleDateRangeChange = {handleDateRangeChange}/>  

        </ListGroup >
        
        {/* <SideMenu currentMenu = "Graduation Year"/> */}
        
        
    </Card>
    )
}