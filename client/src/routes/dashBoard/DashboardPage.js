import { React, useState, useEffect } from "react";


import { Container, Dropdown, ListGroup, Button, Row, Col, Form } from "react-bootstrap";
import axios from "axios";

// Importing Toast
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom made components
import DashboardGraph from "./dashBoardComponents/DashboardGraph";
import DateFilterMenu from "../../components/DateFilterMenu";

const routeURL = "/api/graph"


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
    let [newGroup, setNewGroup] = useState ({groupName:null, groupYearRange:{startDate:undefined, endDate:undefined}, graphValidObject:null})


    const [graphSettings, setGraphSettings] = useState({
        currentGraphStyle: null,
        changeGraph: false,
    });
    // set up state for the height of the of the timeline
    // const[timelineHeight, setTimelineHeight] = useState("350px");

    // Have useEffect run after a change is made to selectedGroups  
    useEffect(()=>
    {
        console.log("Add new group to graph data state")
        console.log(selectedGroups)
        fillGraphData()
        
    }, [selectedGroups])
    

    // Function iterates over currently selected groups and adds groups "graphValidObject" to graphData state 
    function fillGraphData()
    {
        selectedGroups.forEach(individualGroup=>
            {
                console.log(individualGroup.graphValidObject)

                // Insert group graph object
                setGraphData((prevState) =>
                {
                    return [...prevState, individualGroup.graphValidObject]
                })
            })
    }

    async function getInitialGroupTotal()
    {
        return axios
                .post(
                    routeURL +"/newGroup",
                    {
                        filter:newFilter,
                        group:newGroup,
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
                    return response
                })
    }

    
    //  If new group is added, iterate over each filter and 
    function handleNewGroup()
    {

        // Given the new group, fetch the initial total of students coresponding to the filter
        getInitialGroupTotal().then((response) => {
            console.log(response);
            
            // Greate object will will represent our group being prepated in an object to be read by our graph
            let indiviudalGroupGraphObject =(
                {
                    groupName:newGroup.groupName,
                    "Number of Graduates": response.data.studentTotal
                })

                console.log(indiviudalGroupGraphObject)

                // Set state of the new groups graph object with its title, and intial graduation count
                setNewGroup((prevState) =>
                {
                    return {...prevState, graphValidObject:indiviudalGroupGraphObject}
                })

                console.log(newGroup)


            // Iterate over each filter and apply it to this group 
            currentFilters.forEach(individualFilter=>
                {   
                    let filterRoute = "/filter"
                    
                    // Send post request out for for each filter data 
                    toast.promise(
                        axios
                            .post(
                                routeURL + filterRoute,
                                {
                                    filter:newFilter,
                                    group:newGroup,
                                    filterType: individualFilter,
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

                                // Grab the filter value
                                indiviudalGroupGraphObject[individualFilter] = response.data.studentTotal
                                console.log(indiviudalGroupGraphObject)
                                // Update group graph object with new filter data
                                setNewGroup((prevState) =>
                                    {
                                        return {...prevState, graphValidObject:indiviudalGroupGraphObject}
                                    })
    
                            }),
                        {
                            pending: "Applying Filter",
                            error: "Failed to apply new filter, there was an issue retreiving server data",
                            success: "New filter added to graph",
                        }
                    );
                    
                })
            
                // if group not in selectedGroups, add it
                setSelectedGroups((prevState) =>
                {
                    return [...prevState, newGroup]
                })

            console.log(indiviudalGroupGraphObject)
            console.log(newGroup)

        });

        console.log("Dog where?")

        // Retreive initial count total of all students for that given filter without a filter
        console.log("xbox one baby")
        
        
        // grap data for each filter selected for the group (iterate over each filter)

            // store the data in graphData 

            // {
            //     groupName: "Computer Science",
            //     "Number of Graduates": 2000, // Add new filter key 
            //     "Received Job": 1500,
            //     "Had an Internship": 700,
            // },
            
        
        console.log("WILLAY WAM WAZZLE")
        console.log(newGroup)
        console.log(selectedGroups)
            
    }
    console.log(newGroup)
    console.log(selectedGroups)

    
    console.log(graphData)

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

            // Go over each group and apply this new filter
            selectedGroups.forEach(individualGroup =>
                {
                    console.log(individualGroup)

                    console.log("trying to add new filter")
                    // Grab data for each group given the filter from the database
                    toast.promise(
                        axios
                            .post(
                                routeURL +"/filter",
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

    // Function removes group object from the list of currently selected groups
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

    // Function removes filter from each group
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
                        <DashboardGraph graphSettings={graphSettings} graphData={graphData}></DashboardGraph>
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
                            <ListGroup.Item key={value.groupName + index} className="mt-3">
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
