import {React, useState} from "react";

// Bootstrap
import {Card, ListGroup, Button, Form} from "react-bootstrap"

// Other Components
import SideMenu from "./SideMenu";
import SearchFilterMenu from "../../../components/SearchFilterMenu";



// Functions holds filter options for Linkedin data fecthing
export default function FilterSelectors({...props})
{
    const [showSideMenu, setShowSideMenu] = useState(false)
    const [clickedFilter, setClickedFilter] =useState(undefined)
    const [selectedFilters, setSelectedFilters] = useState({
        gradDateRanges: {startDate:undefined, endDate:undefined},
        filteredMajors: null,
        lastTimeUpdatedRange:{startDate:undefined, endDate:undefined,
        fetchOnlyUserAddedData:false
        
        }

        
    })

    // Grab the prop functions to update our parent components state
    const handleSearchFilterChange = props.handleMajorFilterChange
    const handleLastTimeUpdatedRange = props.handleLastTimeUpdatedRange
    const handleDateRangeChange = props.handleDateRangeChange
    const handlefetchOnlyUserAddedDataChange = props.handlefetchOnlyUserAddedDataChange
    let parentState = props.parentState


    // // Grabs the selected majors to filter and returns them in an array of strings 
    // function handleSearchFilterChange(arrayOfFilteredMajor)
    // {
    //     setSelectedFilters(prevState => {return {...prevState, filteredMajors:arrayOfFilteredMajor}})
    // }

    // console.log(selectedFilters.dateRanges)

    // // Grabs the selected year ranges from the filter menu 
    // function handleDateRangeChange(ranges)
    // {
    //     setSelectedFilters((prevState => { return {...prevState, dateRanges:ranges}}))
    // }

    // function handleLastTimeUpdatedRange(ranges)
    // {
    //     setSelectedFilters((prevState => { return {...prevState, lastTimeUpdatedRange:ranges}}))
    // }

    let filterList = ["Computer Science", "Mechanical Engineering", "Applied Computer Science", "Electrical Engineering", "Cyber Security", "Physics"]


    let filterMenu =<SearchFilterMenu customOption = {filterList} handleSearchFilterChange = {handleSearchFilterChange} parentState ={parentState}/>

    console.log(selectedFilters.lastTimeUpdatedRange)
    
    return(
    <Card style={{ width: '18rem', }} className= "">
        <Card.Header><h3>Linkedin Filter</h3></Card.Header>
        <ListGroup variant="flush">

            <SideMenu currentMenu = "Major" handleSearchFilterChange = {handleSearchFilterChange} parentState = {parentState.filteredMajors} filterMenu = {filterMenu}/>
            <SideMenu currentMenu = "Student Upload Range" handleLastTimeUpdatedRange = {handleLastTimeUpdatedRange}/>
            <SideMenu currentMenu = "Graduation Year" handleDateRangeChange = {handleDateRangeChange}/>  

        </ListGroup >
        
        {/* <SideMenu currentMenu = "Graduation Year"/> */}
        <Form.Check
                            className="text-center"
                            type="switch"
                            id="custom-switch"
                            // label="Check for user to have ability to upload new student data"
                            defaultChecked={false}
                            className="text-muted"
                            onClick={
                                (e) =>
                                {
                                    handlefetchOnlyUserAddedDataChange()
                                }
                            }
                            
                        />
        <p className = "text-muted">Select this option to only fetch data uploaded by you</p>
    </Card>
    )
}