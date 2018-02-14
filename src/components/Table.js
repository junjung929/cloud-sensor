import React from 'react';

const Table = (props) => {

    let tableHeadRow = props.tableHeadRow;
    let tableBody = props.tableBody;
    return (
        <table className="table table-responsive" >
            <thead className="mdb-color lighten-4">
                {tableHeadRow}
            </thead>
            <tbody className="hospital-group">
                {tableBody}
            </tbody>
        </table>
    );
}
export default Table;