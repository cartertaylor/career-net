import React from "react";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

import { DateRangePicker, Calendar, DateRange, DefinedRange } from "react-date-range";
import { addDays } from "date-fns";
import { useState } from "react";

import {Button} from "react-bootstrap"


export default function CalendarFilterMenu()
{
    const [selectedDates, setSelectedDates] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: "selection",
        },
    ]);
    

    // OnChange, send back the data to parent component
    console.log(selectedDates)

    // clears Current dates (Probably not needed)
    function clearAllSelectors()
    {
        // setSelectedDates(prevDates=> {return {...prevDates,
        //     startDate: new Date(),
        //     endDate: addDays(new Date(), 7)}})
    }

    return (
        <div>
            <DateRange
                editableDateInputs={true}
                onChange={(item) => setSelectedDates([item.selection])}
                moveRangeOnFirstSelection={true}
                ranges={selectedDates}
                direction="horizontal"
            />
            
            <hr className = "mt-4"/>
                <Button className = "" variant="danger" onClick={clearAllSelectors}>Clear </Button>

            {/* <DefinedRange
                onChange={item => setSelectedDates([item.selection])}
                ranges={state}
                direction="horizontal"
                
            /> */}  
        </div>
    );
}
