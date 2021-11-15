



import {React, useState, useEffect} from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis , Tooltip, Bar, BarChart, Legend} from 'recharts';
import {Container, Dropdown} from 'react-bootstrap';


const data = [
  {name: 'Computer Science', 'Number of Graduates': 2000, "Received Job": 1500, "Had an Internship": 700},
  {name: 'Exercise Science', 'Number of Graduates':2500, "Received Job": 1100, "Had an Internship": 200},
  {name: 'Electrical Engineering', 'Number of Graduates':1000, "Received Job": 600, "Had an Internship": 100},
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



// console.log(timelineHeight)
  return (
    <div className="App">
      <h1>This is the Dashboard page</h1>

      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Graph Type
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick = {() => console.log("I am a bar Graph")} >Bar Graph</Dropdown.Item>
          <Dropdown.Item onClick = {() => console.log("I am a Line Graph")} >Line Chart</Dropdown.Item>
          <Dropdown.Item onClick = {() => console.log("I am a Pie Chart")} >Pie Chart</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Container className="mt-4 d-flex justify-content-center">
        <LineChart width={730} height={250} data={data2}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Grad Numbers" stroke="#8884d8" />
          <Line type="monotone" dataKey="Received Job" stroke="#82ca9d" />
          <Line type="monotone" dataKey="amt" stroke="red" />
        </LineChart>
      </Container>
      
      <Container className="mt-4 d-flex justify-content-center">
        <BarChart width={730} height={250} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Number of Graduates" fill="#8884d8" /> 
          <Bar dataKey="Received Job" fill="#82ca9d" />
          <Bar dataKey="Had an Internship" fill="#FFC0CB" />
        </BarChart>
     </Container>
     
    </div>
  );
}