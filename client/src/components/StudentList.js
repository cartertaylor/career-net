import React from "react";
import Student from "./Student";
import { Table } from "react-bootstrap/";
import { Container } from "semantic-ui-react";

export default function StudentList({studentList, toggleTodo, grabStudenProfileData }) {
    console.log(studentList);

    return (
        <Container style = {{width:"90%"}}>
            <Table striped bordered hover className="mt-4"  >
                <thead>
                    <tr >
                        <th style={{whiteSpace:"nowrap", width: "1%"}}>First Name</th>
                        <th style={{whiteSpace:"nowrap", width: "1%"}}>Major</th>
                        <th style={{whiteSpace:"nowrap", width: "1%"}}>Work Experience</th>
                        <th style={{whiteSpace:"nowrap", width: "1%"}}>Year</th>
                        <th style={{whiteSpace:"nowrap", width: "1%"}}>View Student</th>
                    </tr>
                </thead>
                <tbody>
                    {studentList.map((givenStudent) => {
                        console.log(givenStudent);
                        return (
                            <Student
                                key={givenStudent.id}
                                toggleTodo={toggleTodo}
                                studentInfo={givenStudent}
                                grabStudenProfileData={grabStudenProfileData}
                            />
                        );
                    })}
                </tbody>
            </Table>
        </Container>
    );
}
