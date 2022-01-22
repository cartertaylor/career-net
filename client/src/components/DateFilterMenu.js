import React, {useState} from "react";
import {FormControl, Form} from 'react-bootstrap/';


// Pass in an array of elements, and this component will generate a menu to search those elements
const DateFilterMenu = React.forwardRef(
    ({ style, className, customOption,"aria-labelledby": labeledBy }, ref) => {
        
        // State of search bar
        const [searchValue, setSearchValue] = useState("");

        // State to measure check status of each array filter element passed in
        const [checkStatus, setCheck] = useState({})

        // Create JSX Object for each array element
        let jsxOptions = customOption.map (
            
            individualOption => 

                <Form.Check 
                    type = "checkbox" 
                    checked={checkStatus[individualOption] || false} 
                    className="m-3"
                    label={individualOption}
                    onChange={() => {
                        setCheck(prevState => 
                            {   
                                // Check / uncheck given element in menu (and set the state of that element to said check)
                                return {...prevState, [individualOption]: !checkStatus[individualOption] }
                            })
                        }} />
                    )
        
        return (
            <div
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
            >
                <FormControl
                    autoFocus
                    className="mx-3 my-2 w-auto"
                    placeholder="Type to filter..."
                    onChange={(e) => setSearchValue(e.target.value)}
                    value={searchValue}
                />
                <ul className="list-unstyled">
                    {React.Children.toArray(jsxOptions).filter(
                        (child) =>
                            !searchValue ||
                            child.props.label.toLowerCase().startsWith(searchValue)
                    )}
                </ul>
            </div>
        );
    }
);

export default DateFilterMenu;

