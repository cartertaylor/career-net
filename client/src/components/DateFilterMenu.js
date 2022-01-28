import React, {useState, useEffect} from "react";
import {Form, Container, Button} from 'react-bootstrap/';


// Pass in an array of elements, and this component will generate a menu to search those elements
const DateFilterMenu = React.forwardRef(
    ({ className, grabDateRanges, "aria-labelledby": labeledBy }, ref) => {
        
        // State of each date box
        const [dateValues, setDateValues] = useState({startDate:undefined, endDate: undefined})

        // Only send back state data if we have both values
        useEffect(() => {
            //do operation on state change
            grabDateRanges(dateValues)
            console.log("STATE WAS CHANGED")

        },[dateValues.startDate, dateValues.endDate]) //Change is dependent if state is updated

        // Get Year Selections for the starting range
        let startOptions = getYearsArray("start")
        startOptions = startOptions.map (yearOption=> <option value = {yearOption} key={yearOption}>{yearOption}</option> )

        // Get Year Selections for the ending range
        let endOptions = getYearsArray("end")
        endOptions = endOptions.map (yearOption=> <option value = {yearOption} key={yearOption}>{yearOption} </option> )

        // Retreives the array of years for the range (start vs end, EX: 2010 - 2014)
        function getYearsArray(rangeSelector)
        {
            let startYear = 2010

            // If end range box is selected, then we want its range of years to begin at startDate value
            if (rangeSelector == "end")
            {
                startYear = dateValues.startDate
            }

            let currentYear = new Date().getFullYear()
            let years = [];

            // Create array of years that should be included in selector
            while ( startYear <= currentYear )
            {
                years.push(startYear)
                startYear ++
            }

            // FIXME: Multiple rerenders being logged here because of state manipulation (somewhere along the line). Need to fix at some point
            // STATE is updating when we need it to, but because VARs at top arent controlled, there are multiple logs
            console.log(years)
            console.log(dateValues.startDate)
            console.log(startYear)

            return years
        }

        // Clears slected filter options for that given menu  
        function clearAllSelectors()
        {
            setDateValues(prevState=> {return {...prevState, startDate:"Choose Year", endDate:"Choose Year"}})
        }

        return (
            <div
                ref={ref}
                className={className}
                aria-labelledby={labeledBy}
            >
                <h5 className="m-2 mb-3">Date Filters</h5>
                <Container className= "d-flex">

                    <Form.Select aria-label="Start Range"
                        onChange={ (e)=> {
                            console.log("First state change")
                            let currentValue = e.target.value
                            setDateValues(prevYear =>{ return {...prevYear, startDate:currentValue}})
                        }}
                        value={dateValues.startDate}
                    >
                        
                    <option>Choose Year</option>
                        {startOptions}

                    </Form.Select>
                    
                    <p className="text-center m-2"> - </p>

                    <Form.Select aria-label="End Range"
                        title="yo"
                        onChange={ (e)=> {
                            console.log( e.target.value)
                            let currentValue = e.target.value
                                setDateValues(prevYearSelect =>{ return {...prevYearSelect, endDate:currentValue}})
                        }}
                    >
                        <option>Choose Year</option>
                        {endOptions}

                    </Form.Select>

                </Container>
                <hr className = "mt-4"/>
                <Button className = "" onClick={clearAllSelectors}>Clear </Button>
            </div>
        );
    }
);

export default DateFilterMenu;

