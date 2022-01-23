import React, {useState} from "react";
import {FormControl, Form, Container} from 'react-bootstrap/';


// Pass in an array of elements, and this component will generate a menu to search those elements
const DateFilterMenu = React.forwardRef(
    ({ style, className, customOption, "aria-labelledby": labeledBy }, ref) => {
        
        // State of each date box
        const [dateValues, setDateValues] = useState({startDate:undefined, endDate: undefined})

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
            console.log(years)
            console.log(dateValues.startDate)
            console.log(startYear)

            return years
        }

        return (
            <div
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
            >
                <h5 className="m-2 mb-3">Date Filters</h5>
                <Container className= "d-flex">

                    <Form.Select aria-label="Start Range"
                        
                        onChange={ (e)=> {
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
                        onChange={ (e)=> {
                            let currentValue = e.target.value
                                setDateValues(prevYearSelect =>{ return {...prevYearSelect, endDate:currentValue}})
                        }}
                    >
                        <option>Choose Year</option>
                        {endOptions}

                    </Form.Select>

                </Container>
            </div>
        );
    }
);

export default DateFilterMenu;

