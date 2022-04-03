import React, { useState, useEffect } from "react";

// import Bootstrap
// import './node_modules/react-bootstrap/'
import Container from "react-bootstrap/Container";
//import Jumbotron from 'react-bootstrap/Jumbotron';

// import the timeline component
import Timeline from "../../components/Timeline";

// Redux for global storage
import {useSelector} from "react-redux" // Allows access to store


import {
    ButtonGroup,
    ToggleButton,
} from "react-bootstrap/";

export default function StudentProfile() {

    // Accessing store data.
    const studentInfo = useSelector((state) => state.studentInfo);

    // GRAB specific store data
    let clickedStudentInfo = studentInfo.studentInfo

    const LOCAL_STORAGE_KEY = "todoApp.todos";

    // Set the state with the Prop from the other component
    const [currentStudentProfileInfo, setStudentProfileInfo] = useState(0);

    // State to make sure props have been loaded before render
    const [isLoaded, setIsLoaded] = useState(false);

    // Buttons to switch from horizontal and vertical
    const [radioValue, setRadioValue] = useState("VERTICAL_ALTERNATING");

    useEffect(() => {
        const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
        console.log(storedTodos);
        // means we have an existing state stored in our storage
        if (storedTodos & currentStudentProfileInfo) {
            console.log(storedTodos);

            setStudentProfileInfo(storedTodos);
            setIsLoaded(true);
        }
        // First time rendering, render from prop
        else if (clickedStudentInfo != undefined) {
            console.log(clickedStudentInfo);
            setStudentProfileInfo(clickedStudentInfo);
            setIsLoaded(true);
            console.log(isLoaded);
        }
        console.log(currentStudentProfileInfo);
        console.log(isLoaded);
    }, [currentStudentProfileInfo]);

    // store student information if we have state
    useEffect(() => {
        console.log("YOPPPP");
        console.log(localStorage);
        localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify(currentStudentProfileInfo)
        );
    }, [currentStudentProfileInfo]);

    const radios = [
        { name: "Horizontal View", value: "HORIZONTAL" },
        { name: "Vertical View", value: "VERTICAL_ALTERNATING" },
    ];

    function handleRadioChange(e) {
        console.log(e);
        setRadioValue(e);
    }

    console.log(isLoaded);

    // console.log(currentStudentProfileInfo);
    // console.log(currentStudentProfileInfo.newInfo.degree);

    console.log(radioValue);

    console.log(currentStudentProfileInfo);

    // add a button to w

    return (
        // Generate column for
        <div>
            {isLoaded ? (
                <div>
                    <Container className="">
                        <h1 className="text-center">
                            Profile of {currentStudentProfileInfo.firstName}{" "}
                            {currentStudentProfileInfo.lastName}
                        </h1>
                        <h4 className="text-center">
                            Majoring in{" "}
                            {currentStudentProfileInfo.newInfo.degree}
                        </h4>
                        <h3 className="text-center mt-4">
                            Experience Milestones
                        </h3>
                        <hr/>
                    </Container>
                    <Container className="mt-4 d-flex justify-content-center">
                        <Timeline
                            timelineOrientation={radioValue}
                            studentProfileInfo={currentStudentProfileInfo}
                        />
                    </Container>
                </div>
            ) : (
                <p>Loading data</p>
            )}

            <Container className=" d-flex justify-content-center">
                <ButtonGroup className="mb-4">
                    {radios.map((radio, idx) => (
                        <ToggleButton
                            key={idx}
                            id={`radio-${idx}`}
                            type="radio"
                            variant={
                                idx % 2 ? "outline-warning" : "outline-primary"
                            }
                            name="radio"
                            value={radio.value}
                            checked={radioValue === radio.value}
                            onChange={(e) =>
                                handleRadioChange(e.currentTarget.value)
                            }
                        >
                            {radio.name}
                        </ToggleButton>
                    ))}
                </ButtonGroup>
            </Container>
        </div>
    );
}
