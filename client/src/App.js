import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

// import Bootstrap
// import './node_modules/react-bootstrap/'
import Container from 'react-bootstrap/Container';
import {Toast, Form, Button, Nav, Navbar} from 'react-bootstrap/';
//import Jumbotron from 'react-bootstrap/Jumbotron';

// Import Router
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

// Import different Routes
import Login from './routes/home/Login';
import SearchStudents from './routes/seachStudents/SearchStudent';
import StudentProfile from './routes/studentProfile/StudentProfile';
import DashboardPage from './routes/dashBoard/DashboardPage';
import Settings from './routes/settings/Settings';
import Timeline from './components/Timeline';

// functional component
function App () { 

  const[clickedStudentInfo, setClickedStudentInfo] = useState();

  // Creat Handle function to grab information from other props
  function handleGrabComponentState (otheComponentState) 
  {
    console.log("this gets called how many times")
    // useEffect(() => {
    //   props.setAuthenticated(true);
    // }, []);
    // // set the state using the clicked user 
    // setClickedStudentInfo(otheComponentState);

    setClickedStudentInfo(otheComponentState);

  }


  let dog = "dog"

    console.log("Hello");
    console.log(clickedStudentInfo)

    return (
      <Router>
        
         {/* Nav Bar */}
         <Navbar bg="dark" variant="dark" className="mb-4">
            <Container>
              <Navbar.Brand href="/">Navbar</Navbar.Brand>
              <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/school_dashboard">School Dashboard</Nav.Link>
                <Nav.Link href="/search_students">Search For Students</Nav.Link>
                <Nav.Link href="/settings">Settings</Nav.Link>
              </Nav>
            </Container>
          </Navbar>
        
        {/* Routes  */}
        <Routes>
            <Route path = "/" element = {<Login/>} />
            <Route path = "/search_students" element = {<SearchStudents grabState = {handleGrabComponentState} /> } />
            <Route path = "/student_profile/:student" element = {<StudentProfile clickedStudentInfo = {clickedStudentInfo}/>}/>
            <Route path = "/school_dashboard" element = {<DashboardPage/>}/>
            <Route path = "/settings" element = {<Settings/>}/>
          </Routes>
      </Router>
      
    );

}

export default App;