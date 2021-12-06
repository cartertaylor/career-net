



import {React, useState, useEffect} from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis , Tooltip, Bar, BarChart, Legend} from 'recharts';
import {Container, Dropdown} from 'react-bootstrap';
import DashboardGraph from "./dashBoardComponents/DashboardGraph";

const data = [
  {name: 'Computer Science', 'Number of Graduates': 2000, "Received Job": 1500, "Had an Internship": 700},
  {name: 'Exercise Science', 'Number of Graduates':2500, "Received Job": 1100, "Had an Internship": 200},
  {name: 'Mechanical Engineering', 'Number of Graduates':1000, "Received Job": 600, "Had an Internship": 100}
  ];

const data2 = [
  {
    "name": "2019 Graduates",
    "Grad Numbers": 1000,
    "Received Job": 500
  },
  {
    "name": "2020 Graduates",
    "Grad Numbers": 1500,
    "Received Job": 900
  },
  {
    "name": "2021 Graduates",
    "Grad Numbers": 2000,
    "Received Job": 1500
  },

]
export default function DashboardPage() {


  const[graphSettings, setGraphSettings] = useState({
      currentGraphStyle:null,
      changeGraph:false
  });
    // set up state for the height of the of the timeline
    // const[timelineHeight, setTimelineHeight] = useState("350px");


    function handleGraphChange (chosenGraph)
    {
      setGraphSettings(prevState =>
        {
          return {...prevState, currentGraphStyle:chosenGraph}
        })
    }

// console.log(timelineHeight)
  return (
    <div className="App">
      <h1 className="mb-4">  Dashboard </h1>
      
      <Dropdown>
        
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Graph Type
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick = {() => handleGraphChange("BAR")} >Bar Graph</Dropdown.Item>
          <Dropdown.Item onClick = {() => handleGraphChange("LINE")} >Line Chart</Dropdown.Item>
          <Dropdown.Item onClick = {() => handleGraphChange("PIE")} >Pie Chart</Dropdown.Item>
        </Dropdown.Menu>

      </Dropdown>
      
      {/* <h3 className = "text-center mt-4">Comparison between graduates of different majors</h3> */}


     <DashboardGraph graphSettings = {graphSettings}></DashboardGraph>
     
    </div>
  );
}