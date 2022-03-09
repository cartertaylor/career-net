import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

// import Bootstrap
// import './node_modules/react-bootstrap/'
import Container from "react-bootstrap/Container";
import { Nav, Navbar, Offcanvas, Form, FormControl, Button } from "react-bootstrap/";
//import Jumbotron from 'react-bootstrap/Jumbotron';



// Import Router
import { BrowserRouter as Router, Route, Routes, Navigate,Outlet } from "react-router-dom";

// Import different Routes
import Login from "./routes/home/Login";
import SearchStudents from "./routes/seachStudents/SearchStudent";
import StudentProfile from "./routes/studentProfile/StudentProfile";
import DashboardPage from "./routes/dashBoard/DashboardPage";
import CsvPage from "./routes/csvUploader/CsvPage";
import UploadPage from "./routes/uploadPage/UploadPage";
import Settings from "./routes/settings/Settings"

// functional component
function App() {
  const [clickedStudentInfo, setClickedStudentInfo] = useState();

  let [adminAuthorized, setAdminAuthorized] = useState(undefined);
  let [userAuthorized, setUserAuthorized] = useState(undefined)

  const token = localStorage.getItem("token")

  // Creat Handle function to grab information from other props
  function handleGrabComponentState(otheComponentState) {
    setClickedStudentInfo(otheComponentState);
  }

  console.log(adminAuthorized)
  
  // At the end of render, check for admin status
  useEffect(()=>
    {
      checkAdmin()

    },[]
  )
  // Check if current user should have access to admin pages
  async function checkAdmin()
  {
        await axios.post("/auth/isAdmin", "word",
          
            {
              headers: 
                {
                    "x-access-token":localStorage.getItem("token")
                },
            }
        )
        .then((response) => 
        {

          // Set normal user authorized 
          if (response.data.auth)
          {
            console.log("Authorized")
            setUserAuthorized(true)

            // Check if Admin: if so, return true 
            if (response.data.userRole == 1)
            {
              console.log("Setting Admin")
              setAdminAuthorized(true);
            }
            
            // Otherwise assume, we are a normal faculty
            else {
              console.log("Not Admin ")
              setAdminAuthorized(false)
            }
          }

          // Otherwise set authorized to false
          else if (!response.data.auth)
          {
            setUserAuthorized(false)
          }

          
        });

  
  }

  function RequireAuth() {

    console.log(userAuthorized)
    // If Admin hasnt been set yet, return nothing
    if (userAuthorized == undefined)
    {
      return null
    }
    // Redirect to login
    else if (userAuthorized != true) {
      
        return <Navigate to="/" />;
      }
      else if (userAuthorized == true){
      // Otherwise return child Route
      return <Outlet />;
      }
  }

  return (
      <Router>
          {/* Nav Bar */}
          <Navbar bg="primary" variant="dark" className="mb-4">
              <Container>
                  <Navbar.Brand href="/">CareerNet</Navbar.Brand>
                  <Nav className="">
                      <Nav.Link href="/school_dashboard">
                          School Dashboard
                      </Nav.Link>
                      <Nav.Link href="/search_students">
                          Search For Students
                      </Nav.Link>
                      <Nav.Link href="/uploadPage">Upload</Nav.Link>
                      {adminAuthorized ? (
                          <Nav.Link href="/settings">Settings</Nav.Link>
                      ) : null}
                  </Nav>
              </Container>
          </Navbar>

          {/* Routes  */}
          <Routes>

              {/* Default Route (if not authorized) */}
              {!userAuthorized ? (
                    <Route
                      path="*"
                      element={<Navigate to="/" />}
                  />
                ) : null}

              

              {/* Protected Routes  */}
              <Route element={<RequireAuth />}>
                  <Route path="/uploadPage" element={<UploadPage />} />
                  <Route path="/csvUpload" element={<CsvPage />} />
                  <Route path="/school_dashboard" element={<DashboardPage />} />
                  <Route
                      path="/search_students"
                      element={
                          <SearchStudents
                              grabState={handleGrabComponentState}
                          />
                      }
                  />
                  <Route
                      path="/student_profile/:student"
                      element={
                          <StudentProfile
                              clickedStudentInfo={clickedStudentInfo}
                          />
                      }
                  />

                  {/* Only allow settings if the user is an admin */}
                  {adminAuthorized ? (
                      <Route path="/settings" element={<Settings />} />
                  ) : null}

                  {/* Default route for authorized users */}
                  <Route
                      path="*"
                      element={<Navigate to="/search_students" />}
                  />

              </Route>
          </Routes>
      </Router>
  );
}

export default App;
