



import {React, useState, useEffect} from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis , Tooltip, Bar, BarChart, Legend} from 'recharts';
import {Container, Dropdown} from 'react-bootstrap';


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
export default function DashboardGraph({graphSettings}) {

function buildGraph ()
{
    let graph = null;

    

    if (graphSettings.currentGraphStyle == "BAR")
    {
        graph = (
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
        </Container>)
    }
    else if (graphSettings.currentGraphStyle == "LINE")
    {
        graph = (
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
        )
    }

    console.log(graphSettings.currentGraphStyle)

    // RETURN CHOSEN GRAPH
    return graph;

}

// console.log(timelineHeight)
  return (
    <div className="App">

      {graphSettings.currentGraphStyle}
      
      
      <h3 className = "text-center mt-4">Comparison between graduates of different majors</h3>



     {buildGraph()}
     
    </div>
  );
}