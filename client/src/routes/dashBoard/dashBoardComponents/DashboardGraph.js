import { React, useState, useEffect,useMemo, useRef } from "react";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Legend,
    ResponsiveContainer
} from "recharts";
import { Container, Dropdown } from "react-bootstrap";

import {v4 as uuid} from "uuid";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
}) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const COLORS = ["#8884d8", "#82ca9d", "#ff4a6a", "#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const barGraphData = [
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

const data = [
	{ name: 'Group A', value: 400 },
	{ name: 'Group B', value: 300 },
	{ name: 'Group C', value: 300 },
	{ name: 'Group D', value: 200 },
];

// barGraphData[0].map((value, index)=> {
//     console.log(value)
// })
let dog = []
console.log(barGraphData[0])


let graphFilters = []

export default function DashboardGraph({ graphSettings, graphData, selectedFilters=[] }) {

    // const chartData = useMemo(() => graphData.slice(), [graphData.length, graphData, selectedFilters.length, selectedFilters])

    console.log("WEE 1")
    console.log(selectedFilters)
    console.log(graphData)


    function buildGraph() {
        
        let graph = null;
        
        console.log(graphData)
        if ( graphData.length >0)
        {
            console.log(graphData)
            graphFilters = Object.keys(graphData[0]).map(function(key, index) {
                console.log(key)
                console.log(index)
                console.log("WEE WEE")
                
                // Generate Bar for each filter
                if (key != "groupName")
                {
                    return <Bar dataKey={key} key={key+index} fill={COLORS[index % COLORS.length]}/>;
                }
            })
        }

        
        if (graphSettings.currentGraphStyle == "BAR" & graphData.length >0) {
            graph = (
                <Container className="mt-2 d-flex justify-content-center">
                    <BarChart width={730} height={250} data={graphData} key={Math.random()} type = "number">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="groupName" />
                        <YAxis key={graphData.length} type ="number"/>
                        <Tooltip />
                        <Legend />
                        {/* Filters  */}
                        {/* {graphFilters} */}
                        {Object.keys(graphData[0]).map(function(key, index) {
                                console.log(key)
                                console.log(index)
                                console.log("WEE WEE")
                                
                                // Generate Bar for each filter
                                if (key != "groupName")
                                {
                                    return <Bar dataKey={key} key={Math.random()} fill={COLORS[index % COLORS.length] }/>;
                                }
                            })}
                        {/* <Bar dataKey="Number of Graduates" fill="#8884d8" />
                        <Bar dataKey="Received Job" fill="#82ca9d" />
                        <Bar dataKey="Had an Internship" fill="#ff4a6a" /> */}
                    </BarChart>
                </Container>
            );
        } else if (graphSettings.currentGraphStyle == "LINE" & graphData.length >0) {
            graph = (
                <Container aspect={3} className="mt-4 d-flex justify-content-center">
                    <LineChart
                        width={730}
                        height={250}
                        data={graphData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        key={Math.random()}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="groupName" />
                        <YAxis type="number"/>
                        <Tooltip />
                        <Legend />
                        {Object.keys(graphData[0]).map(function(key, index) {
                                console.log(key)
                                console.log(index)
                                console.log("WEE WEE")
                                
                                // Generate Bar for each filter
                                if (key != "groupName")
                                {
                                    return <Line dataKey={key} key={Math.random()} type="monotone" stroke={COLORS[index % COLORS.length]}/>;
                                }
                            })}
                    </LineChart>
                </Container>
            );
        } else if (graphSettings.currentGraphStyle == "PIE" & graphData.length >0) {
            graph = (
                <Container className="d-flex justify-content-center">
                    {/* <h3 className="text-center">Percentage for each major that started a job after college</h3> */}
                    <PieChart width={400} height={400}>
                        {Object.keys(graphData[0]).map(function(key, index) {
                                console.log(key)
                                console.log(index)
                                console.log("WEE WEE")
                                
                                // Generate Bar for each filter
                                if (key != "groupName")
                                {
                                    return <Pie data={graphData} cx={200} cy={200} labelLine={false} label={renderCustomizedLabel} outerRadius={130} fill="#8884d8" dataKey= {key} nameKey = "groupName">   
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                }
                            })}

                        <Tooltip />
                        <Legend />
                    </PieChart>
                </Container>
            );
        }

        console.log(graphSettings.currentGraphStyle);

        // RETURN CHOSEN GRAPH
        return graph;
    }

    // console.log(timelineHeight)
    return (
        <div className="App" key={uuid}>
            

            <h3 className="text-center mt-4">
                {graphSettings.currentGraphStyle} Chart
            </h3>

            {buildGraph()}
        </div>
    );
}
