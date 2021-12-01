import React, { Component } from 'react';
import axios from "axios";



// import Bootstrap
// import './node_modules/react-bootstrap/'
import Container from 'react-bootstrap/Container';
import {Toast, Form, Button, Nav, Navbar} from 'react-bootstrap/';
//import Jumbotron from 'react-bootstrap/Jumbotron';

// Import Router
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

function Settings () {
    const baseURL = "/users/get_linkedin_data";
    
    const [post, setPost] = React.useState(null);



    

    function fetchLinkedinStudentData() {
        axios
          .post(baseURL, {
            title: "Hello World!",
            body: "This is a new post."
          })
          .then((response) => {
            setPost(response.data);
            console.log(response)
          });
      }
      
    //   if (!post) return null;
    return (
    <div>
        <h1>Hi this is the Settings</h1>
       
      <button onClick={fetchLinkedinStudentData}>Create Post</button>

    </div>
    );

}

export default Settings;