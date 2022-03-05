import data from "./data";

import { React, useState, useEffect } from "react";
import { Chrono } from "react-chrono";
import axios from "axios";
import { Button, Spinner } from "react-bootstrap/";

export default function Timeline({ timelineOrientation, studentProfileInfo }) {
    const [studentMilestoneList, setStudentMilestoneList] = useState(null);

    useEffect(() => {
        fetchStudentMilestones();
    }, []);

    function fetchStudentMilestones() {
        console.log("Carter is working ");
        console.log(studentProfileInfo);
        axios
            .post("/students/get_student_milestones", {
                title: "Hello World!",
                studentInfo: studentProfileInfo,
            })
            .then((response) => {
                console.log("billy bobby");

                console.log(response.data.studentMilestones);

                // Take fetched milestones, and but them in format similar to "items" in the timeline
                createTimelineFormatWithMilestones(
                    response.data.studentMilestones
                );
            });
    }

    // set up state for the height of the of the timeline
    // const[timelineHeight, setTimelineHeight] = useState("350px");

    const color = "0d6efd";

    // Referenfce to see how data is formatted in timeline card
    const items1 = [
        {
            title: "June 2019",
            cardTitle: "Job",
            cardSubtitle: "Discover Financial Services",
            cardDetailedText: `Account Specialist`,
            otherData: {
                cardTitle: "Job",
                cardSubtitle: "Discover Financial Services",
                cardDetailedText: `Discover Financial Services`,
            },
        },
    ];

    // define the data that we will be grabbing  to iterate over
    let itemList = getStudentTimelineMilestones();

    // GRABS TIMELINE MILESTONES USING THE GIVEN STUDENT
    function getStudentTimelineMilestones() {
        console.log(studentProfileInfo);
        if (studentProfileInfo.firstName == "Carter") {
            return items1;
        }

        return data;
    }

    function createTimelineFormatWithMilestones(rawStudentMilestones) {
        let finalizedMilestoneList = [];

        console.log(rawStudentMilestones);

        // Sort milestones by data
        rawStudentMilestones.sort((milestone1, milestone2) =>
            milestone1.date_start.localeCompare(milestone2.date_start)
        );

        // iterate over current grabbed
        for (let milestoneIndex in rawStudentMilestones) {
            console.log(milestoneIndex);
            console.log(rawStudentMilestones[milestoneIndex]);

            let dateStr = new Date(
                rawStudentMilestones[milestoneIndex].date_start
            );
            dateStr = dateStr.toLocaleDateString();
            
            let titleJobCompany = rawStudentMilestones[milestoneIndex].milestone_job_title + " at " +rawStudentMilestones[milestoneIndex].milestone_name
            let newObject = {
                title: dateStr,
                cardTitle: rawStudentMilestones[milestoneIndex].milestone_type,
                cardSubtitle:
                    titleJobCompany,
                cardDetailedText:
                    rawStudentMilestones[milestoneIndex].milestone_description,
                otherData: {
                    cardTitle:
                        rawStudentMilestones[milestoneIndex].milestone_type,
                    cardSubtitle:
                        titleJobCompany,
                    cardDetailedText:
                        rawStudentMilestones[milestoneIndex].milestone_description,
                },
            };

            console.log(newObject);
            finalizedMilestoneList.push(newObject);
        }

        console.log("Aragorn, Son of Arathorn");

        console.log(finalizedMilestoneList);

        setStudentMilestoneList(finalizedMilestoneList);
    }

    console.log(timelineOrientation);
    console.log("Nintendo Switch");

    // useEffect(() => {

    //     console.log("Ran this guy")
    //     let heightValue = "600px";

    //     // Check for the orientation type
    //     if (timelineOrientation == "VERTICAL")
    //     {
    //         heightValue = "400px"
    //     }
    //     console.log(timelineHeight)
    //     // set the state depending on what the orientation was
    //     setTimelineHeight(heightValue);

    //   });

    // Function to determine height based on what type of orientation the timeline is
    function getHeightByOrientation() {
        console.log("I am running");
        if (timelineOrientation == "HORIZONTAL") {
            return "1000px";
        } else {
            return "500px";
        }
    }

    function createMilestoneHtml(givenMilestone) {
        console.log(givenMilestone);

        // Instantiate link to icon we want to use
        let image;

        if (givenMilestone.cardTitle == "Internship") {
            image =
                "https://img.icons8.com/ios-filled/100/" +
                "black" +
                "/personal-growth.png";
        } else if (givenMilestone.cardTitle == "Full Time Job") {
            image =
                "https://img.icons8.com/ios-filled/100/" +
                "black" +
                "/new-job.png";
        } else if (givenMilestone.cardTitle == "Education") {
            image = "https://img.icons8.com/ios-filled/452/motarboard.png";
        } else {
            image =
                "https://img.icons8.com/ios-filled/100/" +
                "color" +
                "/teamwork.png";
        }

        console.log(image);
        let imgHTML = <img src={image} alt="twitter" />;

        return imgHTML;
    }

    return (
        <div className="App">
            {studentMilestoneList == null ? (
                <Spinner animation="border" variant="primary" />
            ) : (
                <div
                    style={{
                        width: "850px",
                        height: { getHeightByOrientation },
                    }}
                >
                    <Chrono
                        items={studentMilestoneList}
                        mode={timelineOrientation}
                        titleAlignment="top"
                        scrollable={{ scrollbar: true }}
                        allowDynamicUpdate={true}
                        cardHeight="50px"
                    >
                        <div className="chrono-icons">
                            {studentMilestoneList.map((milestone) => {
                                console.log(milestone);
                                return createMilestoneHtml(milestone);
                            })}
                        </div>
                    </Chrono>
                </div>
            )}
        </div>
    );
}
