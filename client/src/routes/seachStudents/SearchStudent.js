import React, { Component, useState, useEffect } from 'react';

import StudentList  from '../../components/StudentList';
import StudentForm from '../../components/StudentForm';
import StudentSearchBar from './SearchBarComponents/StudentSearcher';
import {v4 as uuid} from "uuid";


// import Bootstrap
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import {Toast, Form, Button, ToastContainer} from 'react-bootstrap/';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import {BrowserRouter as Router, Route, Routes, Link} from "react-router-dom";

// Different route imports
// import StudentProfile from './screens/student-profile/index'


function SearchStudent ( {grabState} ) {

    const[studentInformation, setStudentInformation] = useState({
        data: null,
        apiData: null,
        listStudents: [{id: uuid, firstName:"Carter", lastName:"Taylor", newInfo: null},{id: uuid, firstName:"bob", lastName:"Vance", newInfo: null}],
        isLoading: true,
        showUserAddedResponse:false,
    });

    // state = {
    //     data: null,
    //     apiData: null,
    //     listStudents: [{id: uuid, firstName:"Carter", lastName:"Taylor", newInfo: null},{id: uuid, firstName:"bob", lastName:"Vance", newInfo: null}],
    //     isLoading: true,
    //     showUserAddedResponse:false,
    //   };

  

  function handleRetreiveButton () 
  {
    console.log("yo what is up, my main man");

  }

// FETCH USER DATA BASED ON THE LETTERS FROM THE SEARCH BAR
async function fetchUserData (event)  {

    event.preventDefault()

    console.log(event.target.elements[0].value)

    // Store Student searched by user
    let searchedLetters = {searchLetters: event.target.elements[0].value}

    // console.log(studentInfo.newInfo)

    // Copy existing state
    let copyState = studentInformation;
    
    // POST request using fetch with async/await
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchedLetters)
    };

    // attempt to fetch for user info
    const response = await fetch('/search_user/fetch_user_data', requestOptions);
    const data = await response.json();
    console.log(data)

    // find the exact array of users we want to use (which is stored in an array)
    let foundUsers = data.foundUsers;

    // store data grabbed from the users profiles (but make sure to set a key id)
    let finalData = foundUsers.map ( individualUserData =>  Object.assign(
        
        // for each user, store a unique ID
        {id: individualUserData.id + individualUserData.lastName + individualUserData.newInfo.degree}, individualUserData)

      )
    
    console.log(studentInformation.listStudents)

    console.log(finalData)

    // Set the state with the new Data
    // this.setState({listStudents: finalData, isLoading:false})
    setStudentInformation(prevState => 
        {
            return {...prevState, listStudents: finalData, isLoading: false }
        })
    console.log(studentInformation.listStudents)

    
  }

  // adds to the state (and the table), the user data that is entered in through the form
  function handleAddUser(addedUserInfo)
  {
    
    console.log(addedUserInfo)
    // console.log(this.state.listStudents)
    let userData = {id:uuid}

    // spread the added data into the object
    userData = {...userData, ...addedUserInfo}

    // Send the data to our server to be stored
    const serverResponse = storeUserOnDatabase(userData);
    
    console.log(userData);

    // set the state with our the change
    // console.log(this.state.listStudents)

    console.log(serverResponse)

    setStudentInformation(prevState => 
      {
          return {...prevState, showUserAddedResponse:true }
      })

  }

  async function storeUserOnDatabase  (studentData)
  {
      // POST request using fetch with async/await
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
    };

    // attempt to store data fof student from form
    const response = await fetch('users/add_student', requestOptions);
    const serverResponse = await response.json();

    console.log(serverResponse)

    // should respond accordingly based on the addition.
    return serverResponse;

  }


  function grabUserProfileData (passedInStuduentInfo) 
  {
    console.log("New man is here")

    grabState(passedInStuduentInfo)
  }


  function closeToast ()
  {
  
    // Remove the Toast 
    setStudentInformation(prevState => 
      {
          return {...prevState, showUserAddedResponse:false }
      })

  }

    return (
        <div className="App">
          


          {/* Toast pops up on user creation */}

          <ToastContainer position="top-end" className="p-3">
            <Toast show={studentInformation.showUserAddedResponse} onClose={closeToast}>
              <Toast.Header>
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded me-2"
                  alt=""
                />
                <strong className="me-auto">Student Added!</strong>
                <small>Just Now</small>
              </Toast.Header>
              <Toast.Body>Student Successfully added</Toast.Body>
            </Toast>
          </ToastContainer>

          {/* Search bar for Students */}
          <Container> 
            {/* WILL REPLACE THIS FORM WITH THE NEW SEARCH COMPONENT */}
            <Form onSubmit = {fetchUserData} className=""> 

              <Form.Group className="mb-3" controlId="studentSearch">
                <Form.Label>Search Student</Form.Label>
                
                <Form.Control className type="text" placeholder="Enter Student Name" />
                
                <Form.Text className="text-muted">
                  Search a User, and hit Fetch, to grab the students information
                </Form.Text>
                
              </Form.Group>
              <StudentSearchBar/>
              {/* <Button className="mt-4" variant="primary" type = "submit"> Fetch Student Data</Button> */}
             
            </Form>

          </Container>
          
          {/* Table for students to be displayed */}
          <div>
            
            {studentInformation.isLoading ? 
            <p>Please click the fetch button in order to fetch the most up to date student information </p>
            // else
            : <StudentList studentList = {studentInformation.listStudents} key={uuid} grabStudenProfileData = {grabUserProfileData} />}
          </div>
           
           {/*Add Student Form */}
          <StudentForm addUserData = {handleAddUser} key = {uuid}/>
          

        </div>

     
    );
  
}

export default SearchStudent;