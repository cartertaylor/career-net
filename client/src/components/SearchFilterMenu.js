import React, {useState, useEffect} from "react";
import {FormControl, Form, Button} from 'react-bootstrap/';


// Pass in an array of elements, and this component will generate a menu to search those elements
const SearchFilterMenu = React.forwardRef(
    ({ style, className, customOption, handleSearchFilterChange, clearButton=true, searchTitle = false, "aria-labelledby": labeledBy }, ref) => {

        // State of search bar
        const [searchValue, setSearchValue] = useState("");

        // State to measure check status of each array filter element passed in
        const [checkStatus, setCheck] = useState({})

        // Only send state back if state value is changed
        useEffect(()=>
        {
            let finalState = removeUncheckedValues()
            console.log(finalState)

            let listPropertyNames = Object.keys(finalState);
            console.log(listPropertyNames)

            handleSearchFilterChange(listPropertyNames)

        },[checkStatus])
        
        
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

        // Removes Unchecked values from object before sending state out to main compoent
        function removeUncheckedValues ()
        {
            let newObj = JSON.parse(JSON.stringify(checkStatus));
            let finalObject = {}

            for (let key in newObj)
            {
                // Filter out unchecked "filters options"
                if (newObj[key] == true)
                {
                    finalObject[key] = true
                }
            }
            
            return finalObject
        }

        // Clears slected filter options for that given menu  
        function clearAllSelectors()
        {
            setCheck({})
        }


        return (
            <div
                ref={ref}
                className={className}
                aria-labelledby={labeledBy}
            >

                {searchTitle ?
                    <p className="m-2 mb-3">{searchTitle}</p>
                : null}
                
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
                
                {/* Conditionally render clear button depending on prop selected */}
                {clearButton ? 
                    <div>
                        <hr className = "mt-4"/>
                        <Button className = "ms-2" variant="danger" onClick={clearAllSelectors}>Clear </Button>
                    </div>
                : 
                    null}

            </div>
        );
    }
);

export default SearchFilterMenu;

