import { React, useState, useEffect } from "react";


import { Container, Dropdown, ListGroup, Button, Row, Col, Form } from "react-bootstrap";
import axios from "axios";

// Importing Toast
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom made components
import DashboardGraph from "./dashBoardComponents/DashboardGraph";
import DateFilterMenu from "../../components/DateFilterMenu";
import lodash, { toLower } from "lodash"
import {useSelector, useDispatch} from "react-redux" 
import {bindActionCreators} from "redux"
import {actionCreators} from "../../state/index"


const routeURL = "/api/graph"



// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});


export default function DashboardPage() {
    
    // State variables
    let [currentFilters, setCurrentFilters] = useState([]) // List of filters currently selected by the user
    let [selectedGroups, setSelectedGroups] = useState([]) // List if groups currently slected by the user
    let [graphData, setGraphData] = useState([]) // Contains array of Graph valid objects to be passed to object using selected filters
    let [newFilter, setNewFilter] = useState(null) // Filter staged to be added (once submitted, will be added to currentFilters)
    let [newGroup, setNewGroup] = useState ({groupName:null, groupYearRange:{startDate:undefined, endDate:undefined}, graphValidObject:null, graphShowTitle:null})
    

    const [graphSettings, setGraphSettings] = useState({
        currentGraphStyle: null,
        changeGraph: false,
    });
   
    // Redux
    const userMajorPermissions = useSelector((state) => state.users.majorPermissions);
    const globalGraphDate = useSelector((state) => state.graphData)

    // Redux
    const dispatch = useDispatch();

     /// Find functions / actions we can use to store data
  const { setReduxGraphData } = bindActionCreators( // If a user is authenticated, we store the truth of that here
    actionCreators,
    dispatch
);

    


    console.log(globalGraphDate)

    // Have useEffect run after a change is made to selectedGroups  
    useEffect(()=>
    {
        console.log("Add new group to graph data state")
        console.log(selectedGroups)
        fillGraphData()
        
    }, [selectedGroups.length])
    

    useEffect(()=>
    {
        // CHECk to make sure the group object also inst already in there!
        if (newGroup.graphValidObject != null & checkDuplicateObject(newGroup) == false)
        {
            console.log("RUNNNING add")
        // if group not in selectedGroups, add it
            setSelectedGroups((prevState) =>
            {
                return [...prevState, newGroup]
            })
        }
    }, [newGroup.graphValidObject])


    function checkDuplicateObject(individualValue)
    {
        let duplicateFound = false

        graphData.forEach(individualGraphInfo=>
            {
                console.log("Existing group")
                console.log(individualGraphInfo)
                console.log("VS")
                console.log("New Gruop")
                console.log(individualValue)
                
                console.log("Dragon")
                if (individualValue.graphShowTitle == individualGraphInfo.groupName ) // & checkDuplicateFilters ==true
                {
                    console.log("They are equal")
                    duplicateFound =  true
                }
                
            })
            console.log("only run if there is no duplicate found!")

        console.log(duplicateFound)
        return duplicateFound
    }

    function checkDuplicateFilters(individualValue, individualGraphdata)
    {

        let indiviudalKeys = Object.keys(individualValue.graphValidObject)
        let graphKeys = Object.keys(individualGraphdata)
        let duplicateFound = true



        return indiviudalKeys.equals(graphKeys)

    }

    // Function iterates over currently selected groups and adds groups "graphValidObject" to graphData state 
    function fillGraphData()
    {
        // reset graph data
        // setGraphData([])
        
        let newGraphGroup = []

        selectedGroups.forEach(individualGroup=>
            {
                console.log(individualGroup.graphValidObject )

                if (individualGroup != null ) // & checkDuplicateObject(newGroup) == false
                {
                    console.log("SMAUG")
                    // Insert group graph object
                    // setGraphData((prevState) =>
                    // {
                    //     return [...prevState, individualGroup.graphValidObject]
                    // })

                    newGraphGroup.push(individualGroup.graphValidObject)
                }
            })
            setReduxGraphData(newGraphGroup)
            setGraphData([...newGraphGroup])
            
            
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
                    groupName:newGroup.graphShowTitle,
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

            console.log(indiviudalGroupGraphObject)
            console.log(newGroup)

        });

        console.log("Dog where?")

        // Retreive initial count total of all students for that given filter without a filter

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
                // Set the state of the new group list
                //setCurrentFilters([...newFilterList])

            // Go over each group and apply this new filter
            selectedGroups.forEach(individualGroup =>
                {
                    console.log(individualGroup)
                    let indiviudalGroupGraphObject = individualGroup.graphValidObject
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

                                // Add new filter to local copy of object
                                indiviudalGroupGraphObject[newFilter] = response.data.studentTotal
                                individualGroup.graphValidObject = indiviudalGroupGraphObject
                                // add filter to each group we iterate over
                                console.log(response.data.studentTotal)
                                console.log(indiviudalGroupGraphObject)
                                console.log(selectedGroups)

                                // setNewGroup(individualGroup)

                                // // set state to said group
                                setNewGroup((prevState) =>
                                    {
                                        return {...prevState, graphValidObject:indiviudalGroupGraphObject}
                                    })

                                // // set state to said group
                                // setSelectedGroups((prevState) =>
                                //     {
                                //         return [...prevState, individualGroup]
                                //     })
                                
                                

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
                return (currentGroup.groupName!=removeGroup.groupName || currentGroup.groupYearRange.startDate!=startRange ||  currentGroup.groupYearRange.endDate!=endRange)
            })
        
        console.log("Compare Old group VS New Group")
        console.log(selectedGroups)
        console.log(newGroupList)


        // Set the state of the new group list
        setSelectedGroups([...newGroupList])

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

        // Create copy of our selectedGroups
        let selectedGroupsCopy = selectedGroups

        // Iterate over current filters and remove filter
        selectedGroupsCopy.forEach(individualGroup=>
            {
                // Remove filter from each groups graphValidObject
                delete individualGroup.graphValidObject[filterToBeRemoved]
            })

        // Set the state of the new group list
        setCurrentFilters([...newFilterList])

        // Set groups with the filter removed
        setSelectedGroups([...selectedGroupsCopy])
    }

    console.log(newGroup)


    function handleGraphChange(chosenGraph) {
        setGraphSettings((prevState) => {
            return { ...prevState, currentGraphStyle: chosenGraph };
        });
    }

    function grabDateRanges(ranges)
    {
        let newShowTitle = newGroup.groupName + " " + ranges.startDate + "-" + ranges.endDate


        console.log("CHanged date")
        setNewGroup((prevState) => {
            return { ...prevState, groupYearRange: ranges, graphShowTitle: newShowTitle}
        });
    }

    // If the user wants to filter by companies worked, this will update the filter to also include this company
    function setSpecfiedCompanyFilter(companyName)
    {
        console.log(companyName)
        console.log(newFilter)
        let newFilterString = "Worked at specified company" + ": " + companyName
        console.log(newFilterString)
        setNewFilter(newFilterString)
    }


    // console.log(timelineHeight)
    return (
        <div className="App">
            <Row>
                <Col sm={1}>
               
                </Col>
                <Col className="" sm={11} >
                    <h1 className="mb-4" > Dashboard </h1>
                    {null == null ? <h4 className="mb-2">Please select Chart and filter options!</h4> : null}
                </Col>
            </Row>
         
            
            <Row>
                <Col sm={1}>
                
                </Col>
                <Col>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic" style={{width:"7em"}}>
                            {graphSettings.currentGraphStyle ? <p>{graphSettings.currentGraphStyle}</p> : <p>Graph Type</p>}
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
                    <Col className="mt-4" sm={1}  style={{overflow:"auto", height:"300px", width:"18%"}}>
                        <ListGroup variant="flush" style={{width:"100%"}} >
                            <Row >
                                <Col>
                                    
                                    <ListGroup.Item >
                                        
                                            <Col>
                                                <h5 className="mb-3">Select Filter</h5>
                                                <Form.Select aria-label="Default select example" style = {{width:"95%"}} onChange={
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
                                                    <option value="Worked at specified company">Worked at specified company</option>
                                                </Form.Select>
                                                {newFilter.includes("Worked at specified company") ? 
                                                    <Form.Group className="mt-1" controlId="formBasicEmail" style = {{width:"95%"}} onChange={(e) => {
                                                        setSpecfiedCompanyFilter(e.target.value) 
                                                    }}>
                                                        <Form.Label>Company Name</Form.Label>
                                                        <Form.Control type="text" placeholder="Enter company name" />
                                                        <Form.Text className="text-muted">
                                                            This will select all students in the major that have worked at the specified company
                                                        </Form.Text>
                                                    </Form.Group>
                                                    : null}
                                            </Col>
                                            <Col>
                                                <Button className="mt-3" onClick= {handleAddFilter}>Add Filter</Button>
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

                    <Col className="me-5" >
                        <DashboardGraph graphSettings={graphSettings} graphData={graphData} selectedFilters={currentFilters}></DashboardGraph>
                    </Col>
                </Row>
                
            </Container>
            
            <Row>
                <Col sm={1}> </Col> 

                <Col className="mr-3" sm={11} >
                
            
            <Container style={{width:"60%"}} className = "mt-4 mb-5">
                
                <ListGroup variant="">
                    {/* Iterate over currently selected groups */}
                    <ListGroup.Item>
                        <Row>
                            <Col>
                                <h5 className="m-2 mb-3">Select Group</h5>
                                <Form.Select aria-label="Default select example" onChange={
                                    (e)=> {

                                        let startDate = newGroup.groupYearRange.startDate
                                        let endDate = newGroup.groupYearRange.endDate

                                        let newShowTitle = e.target.value + " " + newGroup.groupYearRange.startDate + "-" + newGroup.groupYearRange.endDate

                                        if (startDate == undefined)
                                        {
                                            newShowTitle = e.target.value 
                                        }
                                        

                                        

                                        setNewGroup((prevState) => {
                                            return { ...prevState, groupName: e.target.value, graphShowTitle:e.target.value, graphShowTitle:newShowTitle};
                                        })
                                    }
                                }>
                                    <option>Select a group</option>
                                    {userMajorPermissions.map(permission=> 
                                        {
                                            return <option value={permission}>{permission}</option>
                                        })}
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

                        let yearString = startRange + " - " + endRange 
                        // 
                        if (startRange == "Choose Year" || startRange == null)
                        {
                            yearString = "Any Grad Year"
                        }
                        
                        
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
                                            {yearString}
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
            </Col>


            </Row>
        </div>
    );
}
