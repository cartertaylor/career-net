import React from "react";
import Student from "./Student";
import {Table} from 'react-bootstrap/';


export default function StudentList ({studentList, toggleTodo, grabStudenProfileData})
{
    console.log(studentList)
    
   

    return (
        <Table striped bordered hover className="mt-4" >
            <thead>
              <tr>
                <th>First Name</th>
                <th>Major</th>
                <th>Work Experience</th>
                <th>Year</th>
                <th>View Student</th>
              </tr>
            </thead>
            <tbody>

            {studentList.map(givenStudent => {
                console.log( givenStudent)
                return <Student key = {givenStudent.id} toggleTodo ={toggleTodo} studentInfo = {givenStudent} grabStudenProfileData={grabStudenProfileData}/>
            })}
        
            </tbody>
            
            
        </Table>
        
    )
}