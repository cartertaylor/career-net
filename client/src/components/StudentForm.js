import {React} from "react";
import Student from "./Student";
import {Container, Form, Button, Row, Col, Table, InputGroup} from 'react-bootstrap/';

export default function StudentForm ({addUserData})
{   
    function handleFormSubmit(event)
    {   
        event.preventDefault()
        console.log(event.target.elements[0].value)
        const formData = new FormData(event.target),
                formDataObj = Object.fromEntries(formData.entries())

        console.log(formDataObj)
        
        
        // Grabs values from user submitted form
        let foundName = event.target.elements[0].value
        let foundLastName = event.target.elements[1].value
        let foundDegree = event.target.elements[2].value
        let foundExperience = event.target.elements[3].value
        let foundSchoolYear = event.target.elements[4].value

        // sets up object to send back to our main state 
        let formArray =
         {
          firstName:foundName,
          lastName:foundLastName, 
          newInfo:
           {
             degree:foundDegree,
             experience:foundExperience,
             schoolYear:foundSchoolYear
            }
          }

        console.log(event.target.elements)
        addUserData(formArray)
    }

    // function handleFormChange(fieldBox)
    // {   
    //     console.log(fieldBox)
    //     console.log(formData)
    //     setFormData(formData.state);
    //     console.log(formData)
    //     // e => setFormData(prevName =>e.target.value)
    // }


    return (
        <Container>
        <Form onSubmit = {handleFormSubmit}>
        
          <Form.Group className="mb-6" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter Name"/>
            <Form.Text className="text-muted">
              Enter Name
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-6" controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" placeholder="Enter Name"/>
            <Form.Text className="text-muted">
              Enter Last Name
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="degree">
            <Form.Label>Degree</Form.Label>
            <Form.Control type="text" placeholder="Degree" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="workExpeience">
            <Form.Label>Work Experience</Form.Label>
            <Form.Control type="text" placeholder="Work Experience" />
          </Form.Group>
         
          <Form.Group className="mb-3" controlId="Year">
            <Form.Label>Year</Form.Label>
            <Form.Control type="text" placeholder="Year" />
          </Form.Group>
         

          <Button variant="primary" type="submit">
            Submit
          </Button>
          
        </Form>
      </Container>
        
    )
}