import { React, useState } from "react";


import { Container, Dropdown, ListGroup, Button, Row, Col, Form } from "react-bootstrap";
import axios from "axios";

// Importing Toast
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom made components
import DashboardGraph from "./dashBoardComponents/DashboardGraph";
import DateFilterMenu from "../../components/DateFilterMenu";

const routeURL = "/api/graph/internshipFilter"


const data = [
    {
        groupName: "Computer Science",
        "Number of Graduates": 2000,
        "Received Job": 1500,
        "Had an Internship": 700,
    },
    {
        groupName: "Exercise Science",
        "Number of Graduates": 2500,
        "Received Job": 1100,
        "Had an Internship": 200,
    },
    {
        groupName: "Mechanical Engineering",
        "Number of Graduates": 1000,
        "Received Job": 600,
        "Had an Internship": 100,
    },
];

const data2 = [
    {
        groupName: "2019 Graduates",
        "Grad Numbers": 1000,
        "Received Job": 500,
    },
    {
        groupName: "2020 Graduates",
        "Grad Numbers": 1500,
        "Received Job": 900,
    },
    {
        groupName: "2021 Graduates",
        "Grad Numbers": 2000,
        "Received Job": 1500,
    },
];
export default function DashboardPage() {
    
    let [currentFilters, setCurrentFilters] = useState([])
    let [selectedGroups, setSelectedGroups] = useState([])
    let [graphData, setGraphData] = useState([])
    let [newFilter, setNewFilter] = useState(null)
    let [newGroup, setNewGroup] = useState ({groupName:null, groupYearRange:{startDate:undefined, endDate:undefined}})

    const [graphSettings, setGraphSettings] = useState({
        currentGraphStyle: null,
        changeGraph: false,
    });
    // set up state for the height of the of the timeline
    // const[timelineHeight, setTimelineHeight] = useState("350px");

    // Have useEffect run after a change is made to selectedGroups  
    

    
    //  If new group is added, iterate over each filter and 
    function handleNewGroup()
    {
        let arrayOfGraphData = []
        // Iterate over each group 

            // create new entry for given group
            // arrayOfGraphData.push({groupName: currentGroup})

            // grap data for each filter selected for the group (iterate over each filter)

                // store the data in graphData 

                // {
                //     groupName: "Computer Science",
                //     "Number of Graduates": 2000, // Add new filter key 
                //     "Received Job": 1500,
                //     "Had an Internship": 700,
                // },
                
            // if group not in selectedGroups, add it
            setSelectedGroups((prevState) =>
            {
                return [...prevState, newGroup]
            })
            console.log("WILLAY WAM WAZZLE")
            console.log(newGroup)
            console.log(selectedGroups)
                
    }

    // If a new filter is applied, iterate over each group and pull the data for that filter
    function handleAddFilter()
    {   console.log("goku")
        console.log(currentFilters)

        // Check to make sure that filter isnt already applied
        if (currentFilters.includes(newFilter) == false)
            {

                
            setCurrentFilters((prevState) =>
                {
                    return [...prevState, newFilter]
                })

            // over each group and apply this new filter

            selectedGroups.forEach(individualGroup =>
                {
                    console.log(individualGroup)

                    console.log("trying to add new filter")
                // Grab data for each group given the filter from the database
                toast.promise(
                    axios
                        .post(
                            routeURL,
                            {
                                filter:newFilter,
                                group:individualGroup,
                                message:"Retreiving data given the selected group and filter"
                            },
                            {
                                headers: {
                                    "x-access-token": localStorage.getItem("token"),
                                },
                            }
                        )
                        .then((response) => {
                            console.log(response);
                            if (response.status == "Failed") {
                                return Promise.reject();
                            }
                            // TODO: Create front end reaction based on response from server (success / failure)
                        }),
                    {
                        pending: "Applying Filter",
                        error: "Failed to apply new filter, there was an issue retreiving server data",
                        success: "New filter added to graph",
                    }
                );

                })
            
            }
        

            
    }

    // Function 
    function handleRemoveGroup(removeGroup)
    {
        console.log(selectedGroups)
        console.log("trying to remove group")
        // iterate over currently selected group

        let startRange = removeGroup.groupYearRange.startDate;
        let endRange = removeGroup.groupYearRange.endDate;

        // Filter out group we want to remove from the state
        let newGroupList = selectedGroups.filter(currentGroup=>
            {
                return currentGroup.groupName!=removeGroup.groupName || currentGroup.groupYearRange.startDate!=startRange ||  currentGroup.groupYearRange.endDate!=endRange
            })
        
        // Set the state of the new group list
        setSelectedGroups(newGroupList)

        // setSelectedGroups((prevState)=>
        // {
        //     return [...prevState, prevState.filter(currentGroup=>currentGroup.groupName!=removeGroupName)]
        // })

        console.log(selectedGroups)
    }

    function handleRemoveFilter(filterToBeRemoved)
    {
        console.log("hey man")

        console.log(currentFilters)
        console.log("Removing: " + filterToBeRemoved)
        
        let newFilterList = currentFilters.filter(individualFilter=>individualFilter!=filterToBeRemoved)
        console.log(newFilterList)
        // Set the state of the new group list
        setCurrentFilters(newFilterList)

    }

    console.log(newGroup)


    function handleGraphChange(chosenGraph) {
        setGraphSettings((prevState) => {
            return { ...prevState, currentGraphStyle: chosenGraph };
        });
    }

    function grabDateRanges(ranges)
    {
        console.log("CHanged date")
        setNewGroup((prevState) => {
            return { ...prevState, groupYearRange: ranges };
        });
    }

    // console.log(timelineHeight)
    return (
        <div className="App">
            <h1 className="mb-4"> Dashboard </h1>
            <Row>
                <Col>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Graph Type
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleGraphChange("BAR")}>
                                Bar Graph
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleGraphChange("LINE")}>
                                Line Chart
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleGraphChange("PIE")}>
                                Pie Chart
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>

            {/* <h3 className = "text-center mt-4">Comparison between graduates of different majors</h3> */}

            {/* Contains graph and filter option */}
            <Container>
                <Row >
                    <Col className="mt-5 pt-4 me-5" sm={1}  style={{overflow:"auto", height:"300px", width:"18%"}}>
                        <ListGroup variant="flush" style={{width:"100%"}} >
                            <Row >
                                <Col>
                                    
                                    <ListGroup.Item >
                                        
                                            <Col>
                                                <h5 className="m-2 mb-3">Select Filter</h5>
                                                <Form.Select aria-label="Default select example" style = {{width:"90%"}} onChange={
                                                    (e)=> {
                                                        // let newState = currentFilters;
                                                        // newState.push(e.target.value)
                                                        setNewFilter(e.target.value)
                                                        // setNewFilter((prevState) => {
                                                        //     return [ ...prevState, e.target.value ];
                                                        // })
                                                    }
                                                }>
                                                    <option>Select a Filter</option>
                                                    <option value="Had an Intership">Had An Intership</option>
                                                    <option value="Has a job after graduation">Has A job after graduation</option>
                                                </Form.Select>
                                            </Col>
                                            <Col>
                                                <Button className="mt-4" onClick= {handleAddFilter}>Add Filter</Button>
                                            </Col>
                                        
                                    </ListGroup.Item>
                                    {currentFilters.map((value, index)=>
                                        {
                                            console.log(value)
                                            console.log("hey hey hye ")
                                            let returnElement = (
                                                <ListGroup.Item key={value + index} className="mt-3">
                                                    <Row>
                                                        
                                                            <Col>
                                                                {value}
                                                            </Col>
                                                            <Col>
                                                                <Button variant="danger" onClick={()=>handleRemoveFilter(value)}>Remove Filter</Button>
                                                            </Col>
                                                        
                                                    </Row>
                                                </ListGroup.Item>)

                                            return returnElement
                                        }
                                    )}
                                </Col>
                            </Row>
                        </ListGroup>
                    </Col>

                    <Col className="me-5">
                        <DashboardGraph graphSettings={graphSettings}></DashboardGraph>
                    </Col>
                </Row>
                
            </Container>

            <Container style={{width:"50%"}} className = "mt-4">
                
                <ListGroup variant="">
                    {/* Iterate over currently selected groups */}
                    <ListGroup.Item>
                        <Row>
                            <Col>
                                <h5 className="m-2 mb-3">Select Group</h5>
                                <Form.Select aria-label="Default select example" onChange={
                                    (e)=> {
                                        setNewGroup((prevState) => {
                                            return { ...prevState, groupName: e.target.value };
                                        })
                                    }
                                }>
                                    <option>Select a group</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                                    <option value="Electrical Engineering">Electrical Engineering</option>
                                </Form.Select>
                            </Col>
                            <Col sm={5}>
                                <DateFilterMenu grabDateRanges={grabDateRanges} clearButton={false}/>
                            </Col>
                            <Col>
                                <Button className="mt-4" onClick= {handleNewGroup}>Add Group</Button>
                            </Col>
                        </Row>
                        
                        {/* <Button as ={Col}> Add</Button>
                        <Button as ={Col}> Add</Button> */}
                    </ListGroup.Item>
                    {console.log(selectedGroups)}
                    {selectedGroups.map((value, index)=>
                    {
                        let startRange = value.groupYearRange.startDate;
                        let endRange = value.groupYearRange.endDate;
                        
                        
                        let groupString = startRange + " - " + endRange + " " + value.groupName + " Students"
                        console.log(groupString)
                        console.log("patrick")

                        let returnElement = (
                            <ListGroup.Item key={value.groupName} className="mt-3">
                                <Row>
                                    
                                        <Col>
                                            {value.groupName }
                                        </Col>
                                        <Col>
                                            {startRange + " - " + endRange }
                                        </Col>
                                        <Col>
                                            <Button variant="danger" onClick={()=>handleRemoveGroup(value)}>Remove Group</Button>
                                        </Col>
                                    
                                </Row>
                            </ListGroup.Item>)
                        return returnElement
                        
                    })}

                </ListGroup>
            </Container>
        </div>
    );
}
