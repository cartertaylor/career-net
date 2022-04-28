import { React } from "react";
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
import { Container,Row, Col } from "react-bootstrap";
import {useSelector} from "react-redux" 
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

// Example of how data is stored in graphs
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





let graphFilters = []

export default function DashboardGraph({ graphSettings, graphData, selectedFilters=[] }) {

    const globalGraphData = useSelector((state) => state.graphData)


    console.log("WEE 1")
    console.log(selectedFilters)
    console.log(graphData)
    console.log("NEW LENGTH: " + selectedFilters.length + graphData.length)
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
                <Container className="mt-2 d-flex justify-content-center" >
                    <BarChart width={730} height={250} data={graphData} key={JSON.stringify(globalGraphData)} type = "number">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="groupName" />
                        <YAxis key={JSON.stringify(graphData)} type ="number"/>
                        <Tooltip />
                        <Legend wrapperStyle={{ position: 'relative' }} />
                        {/* Filters  */}
                        {/* {graphFilters} */}
                        {Object.keys(globalGraphData[0]).map(function(key, index) {
                                console.log(key)
                                console.log(index)
                                console.log("WEE WEE")
                                
                                // Generate Bar for each filter
                                if (key != "groupName")
                                {
                                    return <Bar dataKey={key} key={key + index} fill={COLORS[index % COLORS.length] }/>;
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
                        key={JSON.stringify(globalGraphData)}
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

                        <Row>
                            {Object.keys(graphData[0]).map(function(key, index) {
                                    console.log(key)
                                    console.log(index)
                                    console.log(graphData)
                                    
                                    // Generate Bar for each filter
                                    if (key != "groupName")
                                    {
                                        return (
                                        <Col xs={6}>
                                            <h3>{key}</h3>
                                            <PieChart width={400} height={400} key={JSON.stringify(globalGraphData)} margin={{ top: -55, bottom:60}}>
                                            
                                                <Pie data={graphData} cx={200} cy={200} labelLine={false} label={renderCustomizedLabel} outerRadius={130} fill="#8884d8" dataKey= {key} nameKey = "groupName">   
                                                    {graphData.map((entry, index) => (
                                                        
                                                        <Cell
                                                            key={`cell-${Math.random() }`}
                                                            fill={COLORS[index % COLORS.length]}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </Col>
                                        )
                                    }
                                })}
                            </Row>
                </Container>
            );
        }

        // RETURN CHOSEN GRAPH
        return graph;
    }

    return (
        <div className="App" key={uuid}>
            
            {/* Return the built graph */}
            {buildGraph()}
        </div>
    );
}
