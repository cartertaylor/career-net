import React, { useEffect }  from "react";
import {} from 'react-bootstrap/';
import {BrowserRouter as Router, Route, Routes, Link} from "react-router-dom";
export default function Student ({studentInfo, grabStudenProfileData})
{
    
    // returns objects
    function handleData(userData) 
    {   
        if (userData)
        {   // Returns a column for each found user field
            let test = (Object.keys(userData).map((key) => {
                return (<td key = {key+""}>{studentInfo.newInfo[key]}</td>)
             })
            )
            console.log(test)
            return test;
        }
    }

    console.log(studentInfo.newInfo)
    
    
    // use Effect to make sure we only render this component once
    // useEffect(() =>    {
    //     fetchUserData(studentInfo.name)
    // }, []);
    
    return (

        // Generate column for 
        <tr>
            <td>{studentInfo.firstName + " " + studentInfo.lastName}</td> 
            {handleData(studentInfo.newInfo)}
            <td><Link to={`/student_profile/${studentInfo.firstName}`} onClick ={() => grabStudenProfileData(studentInfo)}> Click me </Link></td> 
        </tr>
        
        
        )
        
    
}