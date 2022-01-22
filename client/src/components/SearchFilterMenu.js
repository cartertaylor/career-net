import React, {useState} from "react";
import {Dropdown, FormControl, Form, Check} from 'react-bootstrap/';

// Pass in an array of elements, and this component will generate a menu to search those elements
const SearchFilterMenu = React.forwardRef(
    ({ style, className, customOption,"aria-labelledby": labeledBy }, ref) => {
        const [value, setValue] = useState("");

        // Create JSX Object for each array element
        let jsxOptions = customOption.map(individualOption=> <Form.Check className="m-3" label={individualOption} />)

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
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                />
                <ul className="list-unstyled">
                    {React.Children.toArray(jsxOptions).filter(
                        (child) =>
                            !value ||
                            child.props.label.toLowerCase().startsWith(value)
                    )}
                </ul>
            </div>
        );
    }
);

export default SearchFilterMenu;

