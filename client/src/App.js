import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

// import Bootstrap
// import './node_modules/react-bootstrap/'
import Container from "react-bootstrap/Container";
import { Toast, Form, Button, Nav, Navbar } from "react-bootstrap/";
//import Jumbotron from 'react-bootstrap/Jumbotron';

// Import Router
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Import different Routes
import Login from "./routes/home/Login";
import SearchStudents from "./routes/seachStudents/SearchStudent";
import StudentProfile from "./routes/studentProfile/StudentProfile";
import DashboardPage from "./routes/dashBoard/DashboardPage";
import Settings from "./routes/settings/Settings";
import Timeline from "./components/Timeline";
import CsvPage from "./routes/csvUploader/CsvPage";

// functional component
function App() {
  const [clickedStudentInfo, setClickedStudentInfo] = useState();

  // Creat Handle function to grab information from other props
  function handleGrabComponentState(otheComponentState) {
    setClickedStudentInfo(otheComponentState);
  }

  return (
    <Router>
      {/* Nav Bar */}
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand href="/">CareerNet</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/school_dashboard">School Dashboard</Nav.Link>
            <Nav.Link href="/search_students">Search For Students</Nav.Link>
            <Nav.Link href="/settings">Settings</Nav.Link>
            <Nav.Link href="/csvUpload">Upload CSV</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Routes  */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/search_students"
          element={<SearchStudents grabState={handleGrabComponentState} />}
        />
        <Route
          path="/student_profile/:student"
          element={<StudentProfile clickedStudentInfo={clickedStudentInfo} />}
        />
        <Route path="/school_dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/csvUpload" element={<CsvPage />} />
      </Routes>
    </Router>
  );
}

export default App;
