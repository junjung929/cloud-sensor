import _ from "lodash";
import React from "react";
import { Pagination, Icon } from "semantic-ui-react";
const Table = ({ tableBody, tableHeadRow, pages, onPageChange }) => {
  return (
    <table className="table table-responsive">
      <thead className="mdb-color lighten-4">
        <tr>{renderTableHeadRow(tableHeadRow)}</tr>
      </thead>
      <tbody className="hospital-group">{renderTableBodyRows(tableBody)}</tbody>
      {Math.ceil(pages) > 1 ? (
        <tfoot>
          <tr>
            <td colSpan="100%" className="text-right">
              <Pagination
                onPageChange={onPageChange}
                defaultActivePage={1}
                ellipsisItem={{
                  content: <Icon name="ellipsis horizontal" />,
                  icon: true
                }}
                firstItem={{
                  content: <Icon name="angle double left" />,
                  icon: true
                }}
                lastItem={{
                  content: <Icon name="angle double right" />,
                  icon: true
                }}
                prevItem={{ content: <Icon name="angle left" />, icon: true }}
                nextItem={{ content: <Icon name="angle right" />, icon: true }}
                totalPages={Math.ceil(pages)}
              />
            </td>
          </tr>
        </tfoot>
      ) : null}
    </table>
  );
};
const renderCells = cells => {
  let i = 0;
  return _.map(cells, cell => {
    if (cell === undefined) return;
    return <td key={`table-body-row-cell-${i++}`}>{cell}</td>;
  });
};
const renderTableBodyRows = rows => {
  let i = 0;
  if (!rows) {
    return (
      <tr>
        <td colSpan="100%" className="text-center">
          No result...
        </td>
      </tr>
    );
  }
  return _.map(rows, row => {
    return <tr key={`table-body-row-${i++}`}>{renderCells(row)}</tr>;
  });
};
const renderTableHeadRow = heads => {
  return _.map(heads, head => {
    return (
      <td key={`table-head-${head}`}>
        <strong>{head}</strong>
      </td>
    );
  });
};
export default Table;
