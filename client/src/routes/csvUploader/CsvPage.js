import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import "../../css/main.css";
import { Container, Button, Row, Col } from "react-bootstrap";
import TableMaker from "../../components/TableMaker";
import axios from "axios";

// Icons
import {FiTrash2} from "react-icons/fi"
import {HiUpload} from "react-icons/hi"

// Importing Toast
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CsvPage() {

    // Arrays for the columns that are validated for students ne wmilestones or new student entries  
    const validNewStudentCsvCols = ["nau_id", "first_name", "last_name", "college_name", "degree", "degree_type", "graduation_year"]
    const validNewMilestoneCsvCols = ["nau_id","college_name","school_name","area_of_study","degree_type","education_start_date", "education_end_date" ,"education_location","milestone_employer","job_title","milestone_location","milestone_description","milestone_start_date","milestone_end_date"]


    // State containing CSV data
    const [parsedCsvData, setParsedCsvData] = useState([null]);

    // State Variables
    let [canUploadStatus, setCanUploadStatus] = useState(false) // Determines if user can upload data
    let [csvParseType, setCsvParseType] = useState(null)  // Uploading new students or milestones for existing students
    let [listInvalidRows, setInvalidRows] = useState(null)  

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length) {
            console.log(acceptedFiles);
            parseFile(acceptedFiles[0]);
        }
    }, []);
    
    
    useEffect (() =>{
        console.log("changing CSV")

        // Only Check Csv if it isnt empty
        if (parsedCsvData[0] != null)
        {   
            checkValidCsv()
        }
        

    }, [parsedCsvData])


    function handleInvalidRowEntry ()
    {
        
    }

    // Checks to see if collumns match up
    function checkValidCols(arrayColNames, uploadType)
    {

        // Set default messages for validation failure
        let csvStatus = {
            success:false,
            message:"CSV verification failed"
        }
        let sendMessage = ("There was an issue validating this CSV for new students because it is missing certain columns or may have mispelled said columns. Columns not found: ")

        let verifyArray = []

        // Set messages and for uploading new milestoness
        if (uploadType == "newStudent")
        {
            csvStatus = {
                success:true,
                message:"CSV validated as a 'New Students' CSV. You can now upload it below."
            }
    
            sendMessage = ("There was an issue validating this CSV for new students because it is missing certain columns or may have mispelled said columns. Columns not found: ")

            verifyArray = validNewStudentCsvCols
        }   

        // Set messages for uploading new milestones
        else if (uploadType == "newMilestones")
        {
            csvStatus = {
                success:true,
                message:"CSV validated as a 'New Milestones' CSV. You can now upload it below."
            }
    
            sendMessage = ("There was an issue validating this CSV for new milestones because it is missing certain columns or may have mispelled said columns. Columns not found: ")
            
            verifyArray = validNewMilestoneCsvCols
        }

        // Compare each column title to see if they are valid
        arrayColNames.forEach(element => {
            console.log(element)
            
            // Compare inputted element to what is considered valid for a brand new student
            if (!verifyArray.includes(element.trim()))
            {   
                if (csvStatus.success )
                {
                    sendMessage += " '" + element + "' "
                }
                else{
                    sendMessage+= ", '" + element + "' "
                }

                // Set status to false since we found an invalid column 
                csvStatus.success = false; 
            }
        });
        
        // If there was no success, set error message
        if (!csvStatus.success)
        {
            csvStatus.message = sendMessage
        }

        // Return the status based on if the CSV was validated
        return csvStatus;
    }

    // checks currently Uploaded CSV and makes sure it either matches brand New students or  Milestone format
    function checkValidCsv()
    {
        // Grab keys of object
        let arrayColNames = Object.keys(parsedCsvData[0])
        console.log(arrayColNames)

        // Check for new student format
        if (arrayColNames.length == 7)
        {     
            // Check if the rows are valid for 'new student upload' 
            let newStudentCsvCheck = checkValidCols(arrayColNames,"newStudent");
            console.log(newStudentCsvCheck)

            if (newStudentCsvCheck.success)
            {
                toast.success(newStudentCsvCheck.message)
                setCsvParseType("newStudents")
                setCanUploadStatus(true)
            }
            else{
                toast.warn(newStudentCsvCheck.message)
                setCsvParseType(null)
                setCanUploadStatus(false)
            }

        }

        // Check for milestones (we set the standards)
        else if (arrayColNames.length >7 & arrayColNames[0] == "nau_id")
        {

            // Check each individual column name to make sure it is valid for new milestones
            let newStudentCsvCheck = checkValidCols(arrayColNames,"newMilestones");

            // Notfy user based on column calidation
            if (newStudentCsvCheck.success)
            {
                toast.success(newStudentCsvCheck.message)
                setCsvParseType("newMilestones")
                setCanUploadStatus(true)
            }
            else{
                toast.warn(newStudentCsvCheck.message)
                setCsvParseType(null)
                setCanUploadStatus(false)
            }
        }

        // If neither were validated, notify user of failure
        else 
        {
            toast.error("No valid CSV provided. Please check the user guide for formatting CSVs for 'New Students' or 'New Milestones'.")
            setCsvParseType(null)
            setCanUploadStatus(false)
        }

    }


    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        onDrop,
        accept: "text/csv",
    });

    const routeURL = "/csvUpload";

    const parseFile = (file) => {
        Papa.parse(file, {
            header: true,
            complete: (results) => {
                setParsedCsvData(results.data);
            },
        });
    };

    const uploadCsvToDatabase = () => {

        // Only upload if they CSV has been determined valid
        if (canUploadStatus == true)
        {
            // send grabbed CSV data to backend
            toast.promise(
                axios
                    .post(
                        "/api"+ routeURL + "/" + csvParseType,
                        {
                            data: parsedCsvData,
                        },
                        {
                            headers: {
                                "x-access-token": localStorage.getItem("token"),
                            },
                        }
                    )
                    .then((response) => {
                        console.log(response);
                        if (response.status == "Failed") {
                            return Promise.reject();
                        }
                        if (response.data.invalidRows.length > 0)
                        {
                            toast.warning("The following students were not added: " + response.data.invalidRows)
                        }
                        // TODO: Create front end reaction based on response from server (success / failure)
                    }),
                {
                    pending: "Uploading Data",
                    error: "Failed to upload data",
                    success: "Succeeded in uploading data",
                }
            );
        }
        else
        {
            toast.warning("No valid CSV provided. You must have a valid CSV in order to upload.")
        }
    }

    // On delete, we should clear all the settings 
    function clearSettings()
    {
        setParsedCsvData([null])
        setCsvParseType(null)
        setCanUploadStatus(false)
    }

    return (
        <div className="App">
            {/* <ToastContainer /> */}
            <ToastContainer
                position="top-center"
                autoClose={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                transition={Slide}
                // theme="colored"
            />

            <Container className="mt-4 ">
                <h2 className="text-center mb-3">CSV Upload</h2>
                <h6 className="mb-4">
                    {" "}
                    Upload a CSV file with from from either with either raw new
                    student data, Handshake, or Student Surveys
                </h6>
            </Container>

            <Container className="d-flex justify-content-center">
                <div
                    {...getRootProps({
                        className: `dropzone
                    ${isDragAccept && "dropzoneAccept"}
            ${isDragReject && "dropzoneReject"}`,
                    })}
                >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <h5>Drop the files here ...</h5>
                    ) : (
                        <h5>Drag CSV file here</h5>
                    )}
                </div>
            </Container>

            {console.log(parsedCsvData)}

            <Container className="mt-2">
                {parsedCsvData[0] != null ? (
                    <TableMaker givenJsonData={parsedCsvData} />
                ) : (
                    <p></p>
                )}
            </Container>
            <Container className="mb-4 mt-3">
                <Row>
                    <Col>
                        <Button
                            variant="danger"
                            onClick={() => clearSettings()}
                        >
                            <FiTrash2 className="mb-1 me-1"/>
                            Delete
                        </Button>
                    </Col>
                    <Col className= "mb-4">
                        <Button onClick={() => uploadCsvToDatabase()}>
                            <HiUpload className="mb-1 me-1"/>
                            Upload
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
