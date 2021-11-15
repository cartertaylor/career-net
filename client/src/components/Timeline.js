
import data from "./data"



import {React, useState, useEffect} from "react";
import { Chrono } from "react-chrono";

export default function Timeline( {timelineOrientation, studentProfileInfo} ) {

    // set up state for the height of the of the timeline
    // const[timelineHeight, setTimelineHeight] = useState("350px");  

    const color = "0d6efd"

    const items = [
      {
        title: "June 2019",
        cardTitle: "Job",
        cardSubtitle:
          "Discover Financial Services",
        cardDetailedText: `Account Specialist`,
        otherData: {
          cardTitle: "Job",
          cardSubtitle: "Discover Financial Services",
          cardDetailedText: `Discover Financial Services`,
        }
      },
      {
        title: "July 2020",
        cardTitle: "Internship",
        cardSubtitle:
          "American Express",
        cardDetailedText: `Information Security Analyst`,
        otherData: {
          cardTitle: "Internship",
          cardSubtitle: "American Express",
          cardDetailedText: `Information Security Analyst`,
        }
      },
      {
        title: "June 2021",
        cardTitle: "Internship",
        cardSubtitle:
          "American Express",
        cardDetailedText: `Information Security Analyst`
      },
      {
        title: "25 July 1940",
        cardTitle: "The Battle of Britain",
        cardSubtitle: `RAF Spitfire pilots scramble for their planes`,
        cardDetailedText: `After France’s surrender in June 1940, Churchill told the British people, “Hitler knows that he will have to break us in this island or lose the war”. To mount a successful invasion, the Germans had to gain air superiority. The first phase of the battle began on 10 July with Luftwaffe attacks on shipping in the Channel.
          The following month, RAF Fighter Command airfields and aircraft factories came under attack. Under the dynamic direction of Lord Beaverbrook, production of Spitfire and Hurricane fighters increased, and despite its losses in pilots and planes, the RAF was never as seriously weakened as the Germans supposed.`
      },
   
    ];
    // GRABS TIMELINE MILESTONES USING THE GIVEN STUDENT
    function getStudentTimelineMilestones()
    {
      if (studentProfileInfo.firstName == "Carter")
      {
        return items;
      }

      return data
    }

    console.log(timelineOrientation);
    console.log("Nintendo Switch")

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
    function getHeightByOrientation()
    {   
        console.log("I am running")
        if (timelineOrientation == "HORIZONTAL")
        {
            return "1000px"
        }
        else
        {
            return "500px"
        }
    }

    function createMilestoneHtml(givenMilestone)
    {

      console.log(givenMilestone)

      // Instantiate link to icon we want to use
      let image;

      
      if (givenMilestone.cardTitle == "Internship")
      {
        image = "https://img.icons8.com/ios-filled/100/" + color + "/personal-growth.png"
      }

      else if (givenMilestone.cardTitle == "Job")
      {
        image = "https://img.icons8.com/ios-filled/100/" + color + "/new-job.png"
       
      }

      else{
        
        image = "https://img.icons8.com/ios-filled/100/" + "0d6efd" + "/teamwork.png"
      }

      let imgHTML = (<img
      src={image}
      alt="twitter"/>)

      return imgHTML
    }

// console.log(timelineHeight)
  return (
    <div className="App">
      <div style={{ width: "850px", height: {getHeightByOrientation}}}>
        
        <Chrono items={getStudentTimelineMilestones()}
         mode={timelineOrientation}
          titleAlignment="top"
           scrollable={{scrollbar: true}}
            allowDynamicUpdate = {true}
            cardHeight="50px"
            > 
        <div className="chrono-icons"> 
          {items.map(milestone =>
            {
              console.log(milestone)
              return (
                
                createMilestoneHtml(milestone)
            
              )
            })}
           </div>

          
        </Chrono>
        
      </div>
    </div>
  );
}