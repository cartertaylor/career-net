import { React, useState, useEffect } from "react";
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
const data = [
    {
        name: "Computer Science",
        "Number of Graduates": 2000,
        "Received Job": 1500,
        "Had an Internship": 700,
    },
    {
        name: "Exercise Science",
        "Number of Graduates": 2500,
        "Received Job": 1100,
        "Had an Internship": 200,
    },
    {
        name: "Mechanical Engineering",
        "Number of Graduates": 1000,
        "Received Job": 600,
        "Had an Internship": 100,
    },
];

const data2 = [
    {
        name: "2019 Graduates",
        "Grad Numbers": 1000,
        "Received Job": 500,
    },
    {
        name: "2020 Graduates",
        "Grad Numbers": 1500,
        "Received Job": 900,
    },
    {
        name: "2021 Graduates",
        "Grad Numbers": 2000,
        "Received Job": 1500,
    },
];

const data3 = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
];

export default function DashboardGraph({ graphSettings }) {
    function buildGraph() {
        let graph = null;

        const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];


        if (graphSettings.currentGraphStyle == "BAR") {
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
                        <XAxis dataKey="name" />
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
                            data={data}
                            cx={200}
                            cy={200}
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={130}
                            fill="#8884d8"
                            dataKey="Received Job"
                        >
                            {data.map((entry, index) => (
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
