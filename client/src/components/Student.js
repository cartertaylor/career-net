import React, { useEffect } from "react";
import {} from "react-bootstrap/";
import { BrowserRouter as Router, Link } from "react-router-dom";

// Redux for global storage
import {useSelector, useDispatch} from "react-redux" // Allows access to store
import {bindActionCreators} from "redux"
import {actionCreators} from "../state/index"



export default function Student({ studentInfo, grabStudenProfileData }) {


    const dispatch = useDispatch();

    /// Find functions / actions we can use to store data
    const { addClickedStudent } = bindActionCreators(
        actionCreators,
        dispatch
    );

    // IF a student is clicked, store that student info in the store 
    function handleStudentClick (studentInfo)
    {
        console.log(studentInfo)
        addClickedStudent(studentInfo)
    }

    // returns objects
    function handleData(userData) {
        if (userData) {
            // Returns a column for each found user field
            let test = Object.keys(userData).map((key) => {
                console.log(studentInfo.newInfo[key])
                console.log(<td key={key + ""}>{studentInfo.newInfo[key]}</td>)
                return <td key={key + ""}>{studentInfo.newInfo[key]}</td>;
            });
            console.log(test);
            return test;
        }
    }

    console.log(studentInfo.newInfo);

    return (
        // Generate column for
        <tr>
            <td>{studentInfo.firstName + " " + studentInfo.lastName}</td>
            {handleData(studentInfo.newInfo)}
            <td>
                <Link
                    to={`/student_profile/${studentInfo.firstName}`}
                    onClick={() => handleStudentClick(studentInfo)}
                >
                    {" "}
                    Click me{" "}
                </Link>
            </td>
        </tr>
    );
}
