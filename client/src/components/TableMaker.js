import React from "react";
import { Table } from "react-bootstrap/";

export default function TableMaker({givenJsonData})
{   

    function getIndividualValue(row)
    {
        console.log(row)
        // Converets object with keys into an array with each keys valyes
        let arrayValues = Object.values(row)

        // Creates an entry for each column of the current row we are on
        let rowEntries = arrayValues.map(value => <td>{value}</td>)

        return rowEntries;
    }

    function getTableRows (jsonData)
    {
        // Iterates over each row, and creates a table row for them
        let addedRows = (jsonData.map(row => <tr>{getIndividualValue(row)}</tr>))

        return addedRows;

    }

    return (
        <Table striped bordered hover className="mt-4">
            {/* Create headers dynamically */}
            <thead>
                <tr>
                    {Object.keys(givenJsonData[0]).map(value =>
                        {
                            console.log(value)
                            return <th>{value}</th>
                        })}
                </tr>
            </thead>

            <tbody>

                {getTableRows(givenJsonData)}

            </tbody>
            
        </Table>
    );
}
