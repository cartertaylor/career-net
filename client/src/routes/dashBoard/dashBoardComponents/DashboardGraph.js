import { React, useState } from "react";
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
} from "recharts";
import { Container, Dropdown } from "react-bootstrap";

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

// barGraphData[0].map((value, index)=> {
//     console.log(value)
// })
let dog = []
console.log(barGraphData[0])


//console.log([ ...barGraphData[0].keys() ])


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

const data3 = [
    { groupName: "Group A", value: 400 },
    { groupName: "Group B", value: 300 },
    { groupName: "Group C", value: 300 },
    { groupName: "Group D", value: 200 },
];

let graphFilters = []

export default function DashboardGraph({ graphSettings, graphData=[] }) {
    function buildGraph() {
        let graph = null;

      
            console.log(graphData)
            let graphFilters = Object.keys(graphData[1]).map(function(key, index) {
                console.log(key)
                console.log(index)
                console.log("WEE WEE")
                // Generate Bar for each filter
                if (key != "groupName")
                {
                    return <Bar dataKey={key} fill={COLORS[index % COLORS.length]}/>;
                }
            })

        

        if (graphSettings.currentGraphStyle == "BAR") {
            graph = (
                <Container className="mt-2 d-flex justify-content-center">
                    <BarChart width={730} height={250} data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="groupName" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {/* Filters  */}
                        {graphFilters}
                        {/* <Bar dataKey="Number of Graduates" fill="#8884d8" />
                        <Bar dataKey="Received Job" fill="#82ca9d" />
                        <Bar dataKey="Had an Internship" fill="#ff4a6a" /> */}
                    </BarChart>
                </Container>
            );
        } else if (graphSettings.currentGraphStyle == "LINE") {
            graph = (
                <Container className="mt-4 d-flex justify-content-center">
                    <LineChart
                        width={730}
                        height={250}
                        data={data2}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="groupName" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="Grad Numbers"
                            stroke="#8884d8"
                        />
                        <Line
                            type="monotone"
                            dataKey="Received Job"
                            stroke="#82ca9d"
                        />
                    </LineChart>
                </Container>
            );
        } else if (graphSettings.currentGraphStyle == "PIE") {
            graph = (
                <Container className="d-flex justify-content-center">
                    {/* <h3 className="text-center">Percentage for each major that started a job after college</h3> */}
                    <PieChart width={400} height={400}>
                        <Pie
                            data={barGraphData}
                            cx={200}
                            cy={200}
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={130}
                            fill="#8884d8"
                            dataKey="Received Job"
                        >
                            {barGraphData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>

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
        <div className="App">
            {graphSettings.currentGraphStyle}

            <h3 className="text-center mt-4">
                Comparison between graduates of different majors
            </h3>

            {buildGraph()}
        </div>
    );
}
