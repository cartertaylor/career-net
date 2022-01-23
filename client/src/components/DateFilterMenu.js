import React, {useState} from "react";
import {FormControl, Form, Container} from 'react-bootstrap/';


// Pass in an array of elements, and this component will generate a menu to search those elements
const DateFilterMenu = React.forwardRef(
    ({ style, className, customOption,"aria-labelledby": labeledBy }, ref) => {
        
        // State of each date box
        const [dateValues, setDateValues] = useState({startDate:undefined, endDate: undefined})

        // Get Year Selections for the starting range
        let startOptions = getYearsArray("start")
        startOptions = startOptions.map (yearOption=> <option value = {yearOption}>{yearOption}</option> )

        // Get Year Selections for the ending range
        let endOptions = getYearsArray("end")
        endOptions = endOptions.map (yearOption=> <option value = {yearOption}>{yearOption}</option> )

        // Retreives the array of years for the range (start vs end, EX: 2010 - 2014)
        function getYearsArray(rangeBox)
        {
            let startYear = 2010

            if (rangeBox == "start")
            {// Should either be 2010 or start year
                startYear = 2010 
            }
            else
            {
                startYear = dateValues.startDate
            }

            let currentYear = new Date().getFullYear()
            let years = [];

            while ( startYear <= currentYear )
            {
                years.push(startYear)
                startYear ++
            }

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
                    <Form.Select aria-label="Default select example"
                        
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
                    <Form.Select aria-label="Default select example"
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

