import React from "react";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

import {
    DateRangePicker,
    Calendar,
    DateRange,
    DefinedRange,
} from "react-date-range";
import { addDays } from "date-fns";
import { useState, useEffect} from "react";

import { Button,  Dropdown} from "react-bootstrap";


export default function CalendarFilterMenu({handleLastTimeUpdatedRange}) {
    const [selectedDates, setSelectedDates] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: "selection",
        },
    ]);

    // Send back data on state update
    useEffect(()=>
        {
            handleLastTimeUpdatedRange(selectedDates)

        },[selectedDates])

    
        const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
            <Button 
            drop="end"
                href=""
                ref={ref}
                onClick={(e) => {
                    e.preventDefault();
                    onClick(e);
                }}
                variant="outline-primary"
            >
                {children}
                &#x25bc;
            </Button>
        ));


    const DatesMenu = React.forwardRef(
        ({ style, className, "aria-labelledby": labeledBy }, ref) => {    
            return (
                <div
                    ref={ref}
                    style={style}
                    className={className}
                    aria-labelledby={labeledBy}
                >
                    <DefinedRange
                    onChange={item => setSelectedDates([item.selection])}
                    ranges={selectedDates}
                    direction="horizontal"
                    
                />
                </div>
            );
        }
    );
    // OnChange, send back the data to parent component
    console.log(selectedDates);

    // clears Current dates (Probably not needed)
    function clearAllSelectors() {
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

            <Dropdown >
                <Dropdown.Toggle
                    drop="end"
                    as={CustomToggle}
                    id="dropdown-custom-components"
                    className = "textCustom"
                    
                    
                >
                    Select Predefined Range 
                </Dropdown.Toggle>
        
                <Dropdown.Menu 
                    align="start"
                    as={DatesMenu}
                    // className = "dropdown-menu-search"
                >
                    
                </Dropdown.Menu>
        
            </Dropdown>

            <hr className="mt-4" />
            <Button className="" variant="danger" onClick={clearAllSelectors}>
                Clear{" "}
            </Button>

            
        </div>
    );
}
