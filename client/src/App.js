import React, { useState, useEffect } from "react";
import "./App.css";
// import './css/sidebar.css'
import axios from "axios";

// import Bootstrap
// import './node_modules/react-bootstrap/'
import Container from "react-bootstrap/Container";
import { Nav, Navbar, Offcanvas, Form, FormControl, Button, Row,Col } from "react-bootstrap/";

//import Jumbotron from 'react-bootstrap/Jumbotron';

// Import Icons for navigation
import { FaCog } from 'react-icons/fa';
import { BsFillBarChartLineFill, BsSearch} from 'react-icons/bs';
import {FiUpload} from 'react-icons/fi'
import {HiOutlineLogout} from 'react-icons/hi'
import {BiLogOut} from 'react-icons/bi'
import {AiOutlineUser} from 'react-icons/ai'


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
  const { userLoggedInStatus, setUserAdmin, setUserName, grabUserPermissions } = bindActionCreators( // If a user is authenticated, we store the truth of that here
      actionCreators,
      dispatch
  );

  // Accessing store data (Tells if user is authoirzed or not)
  let userIsAuthorized = useSelector((state) => state.users.userLoggedIn);

  // Accessing store data (Tells if user is an admin or not)
  let adminIsAuthorized = useSelector((state) => state.users.userAdmin);

  // Accessing username store data (Tells if user is an admin or not)
  let loggedInUserName = useSelector((state) => state.users.userName);

  // Accessing permission to upload new data (true or false)
  let userCanUploadNewData = useSelector((state) => state.users.userCanUploadNewData);


  console.log(userIsAuthorized)
  console.log(adminIsAuthorized)
  console.log(loggedInUserName)

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
            console.log(response.data)
            userLoggedInStatus(true)
            setUserName(response.data.userName)
            grabUserPermissions()

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
    if (adminIsAuthorized == null)
    {
      return null
    }
    // Redirect to login
    else if (adminIsAuthorized != true) {
      
        return <Navigate to="/search_student" />;
      }

    else if (adminIsAuthorized == true){
      // Otherwise return child Route
      return <Outlet />;
    }
  }

  return (
      <Router>


          {/* Nav Bar */}
          {/* <Navbar bg="primary" variant="dark" className="mb-4">
              <Container>
                  <Navbar.Brand href="/">CareerNet</Navbar.Brand>
                  <Nav className="">
                      <Nav.Link href="/school_dashboard">
                          <BsFillBarChartLineFill className="mb-1" />
                          School Dashboard
                      </Nav.Link>
                      <Nav.Link href="/search_students">
                          <BsSearch className="mb-1" />
                          Search For Students
                      </Nav.Link>
                      <Nav.Link href="/uploadPage">Upload</Nav.Link>
                      {userIsAuthorized ? (
                          <Nav.Link href="/settings">Settings</Nav.Link>
                      ) : null}
                  </Nav>
              </Container>
          </Navbar> */}


          <Navbar bg="primary" variant="dark" expand={false} className="mb-4">
            
              <Container fluid className="">

                  {userIsAuthorized ?  <Navbar.Toggle aria-controls="offcanvasNavbar" /> : null}

                  <Navbar.Brand className = "" href="/">Career Net</Navbar.Brand>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  

                  
                {userIsAuthorized ? (<div className="ms-4"><Navbar.Text pullRight className = "ms-4 justify-content-end ml-auto"> 
                      <a className="" href="/search_students"> <AiOutlineUser className="me-2 mb-1"/>{loggedInUserName}</a>
                  </Navbar.Text>
                  
                  <Button variant="danger" className = "ms-4" href="/" onClick={()=> window.localStorage.removeItem("token")}>
                    <BiLogOut className = "me-1 mb-1" />Logout</Button> </div>) : null}
                  
                    
                      <Navbar.Offcanvas
                      id="offcanvasNavbar"
                      aria-labelledby="offcanvasNavbarLabel"
                      placement="start"
                      style={{ width: "18%" }}
                  >
                  
                      <Offcanvas.Header closeButton>
                          <Offcanvas.Title id="offcanvasNavbarLabel">
                              Career Net Options
                          </Offcanvas.Title>
                      </Offcanvas.Header>
                      <Offcanvas.Body>
                          <Nav className="justify-content-end flex-grow-1 pe-3">
                              <Nav.Link
                                  href="/school_dashboard"
                                  className="mb-2"
                              >
                                  <BsFillBarChartLineFill className="mb-1 me-2" />
                                  School Dashboard
                              </Nav.Link>

                              <Nav.Link
                                  href="/search_students"
                                  className="mb-2"
                              >
                                  <BsSearch className="mb-1 me-2" />
                                  Search For Students
                              </Nav.Link>
                              {userCanUploadNewData ? (
                                <Nav.Link href="/uploadPage" className="mb-2">
                                  <FiUpload className="mb-1 me-2" />
                                  Upload
                                </Nav.Link>
                              ) : null}
                              

                              {adminIsAuthorized ? (
                                  <Nav.Link href="/settings" className="mb-2">
                                      <FaCog className="mb-1 me-2" />
                                      Settings
                                  </Nav.Link>
                              ) : null}
                          </Nav>
                      </Offcanvas.Body>
                  </Navbar.Offcanvas>
                    
                  
  
              </Container>
          </Navbar>

        

          {/* Routes  */}
          <Routes>
              {/* Default route */}
              {userIsAuthorized != true ? (
                  <Route path="/" element={<Login />} />
              ) : null}

              {/* Protected Routes  */}
              <Route element={<RequireAuth />}>

                  {userCanUploadNewData ? <Route path="/uploadPage" element={<UploadPage />} /> : null}
                  
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

                  <Route element={<AdminAuth />}>
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
