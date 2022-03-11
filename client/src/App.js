import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

// import Bootstrap
// import './node_modules/react-bootstrap/'
import Container from "react-bootstrap/Container";
import { Nav, Navbar, Offcanvas, Form, FormControl, Button } from "react-bootstrap/";
//import Jumbotron from 'react-bootstrap/Jumbotron';

// Redux 
import {useSelector, useDispatch} from "react-redux" // Allows access to store
import {bindActionCreators} from "redux"
import {actionCreators} from "./state/index"

// Import Router
import { BrowserRouter as Router, Route, Routes, Navigate,Outlet } from "react-router-dom";

// Import different Routes
import Login from "./routes/home/Login";
import SearchStudents from "./routes/seachStudents/SearchStudent";
import StudentProfile from "./routes/studentProfile/StudentProfile";
import DashboardPage from "./routes/dashBoard/DashboardPage";
import UploadPage from "./routes/uploadPage/UploadPage";
import Settings from "./routes/settings/Settings"

// functional component
function App() {

  // Redux
  const dispatch = useDispatch();

  /// Find functions / actions we can use to store data
  const { userLoggedInStatus, setUserAdmin } = bindActionCreators( // If a user is authenticated, we store the truth of that here
      actionCreators,
      dispatch
  );

  // Accessing store data (Tells if user is authoirzed or not)
  let userIsAuthorized = useSelector((state) => state.users.userLoggedIn);

  // Accessing store data (Tells if user is an admin or not)
  let adminIsAuthorized = useSelector((state) => state.users.userAdmin);

  console.log(userIsAuthorized)
  console.log(adminIsAuthorized)

  // State
  const [clickedStudentInfo, setClickedStudentInfo] = useState();

  // Creat Handle function to grab information from other props
  function handleGrabComponentState(otheComponentState) {
    setClickedStudentInfo(otheComponentState);
  }
  
  // At the end of render, check for admin status
  useEffect(()=>
    {
      checkAdmin()
      console.log(userIsAuthorized)

    },[]
  )
  // Check if current user should have access to admin pages (checks also for normal login authorization)
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
            userLoggedInStatus(true)

            // Check if Admin: if so, return true 
            if (response.data.userRole == 1)
            {
              console.log("Setting Admin")
              setUserAdmin(true)
            }
            
            // Otherwise assume, we are a normal faculty
            else {
              console.log("Not Admin ")
              setUserAdmin(false)
            }
          }

          // Otherwise set authorized to false
          else if (!response.data.auth)
          {
            userLoggedInStatus(false)
          }
  
        });

  
  }

  // Protects Routes to make sure only logged in users can access them
  function RequireAuth() {

    // If Admin hasnt been set yet, return nothing
    if (userIsAuthorized == undefined)
    {
      return null
    }
    // Redirect to login
    else if (userIsAuthorized != true) {
      
        return <Navigate to="/" />;
      }

    else if (userIsAuthorized == true){
      // Otherwise return child Route
      return <Outlet />;
    }
  }

  // Protects Routes to make sure only admins can access them
  function AdminAuth() {

    // If Admin hasnt been set yet, return nothing
    if (userIsAuthorized == null)
    {
      return null
    }
    // Redirect to login
    else if (userIsAuthorized != true) {
      
        return <Navigate to="/search_student" />;
      }

    else if (userIsAuthorized == true){
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
                      {userIsAuthorized ? (
                          <Nav.Link href="/settings">Settings</Nav.Link>
                      ) : null}
                  </Nav>
              </Container>
          </Navbar>

          {/* Routes  */}
          <Routes>
              
              {/* Default route */}
              {userIsAuthorized != true ?
                (
                  <Route path="/" element={<Login />} />

                ): null}
          

              {/* Protected Routes  */}
              <Route element={<RequireAuth />}>
                  <Route path="/uploadPage" element={<UploadPage />} />
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
                  
                  <Route element = {<AdminAuth/>}>
                    <Route path="/settings" element={<Settings />} />
                  </Route>
                  

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
