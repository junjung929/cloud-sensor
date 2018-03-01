import _ from "lodash";
import React from "react";
import { Pagination, Icon, Table } from "semantic-ui-react";
const TableComponent = ({ tBody, tHead, pages, onPageChange }) => {
  return (
    <Table id="table" unstackable >
      <Table.Header>
        <Table.Row>{renderTableHeadRow(tHead)}</Table.Row>
      </Table.Header>
      <Table.Body>{renderTableBodyRows(tBody)}</Table.Body>
      {Math.ceil(pages) > 1 ? (
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="100%" className="text-right">
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
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      ) : null}
    </Table>
  );
};
const renderCells = cells => {
  let i = 0;
  return _.map(cells, cell => {
    if (cell === undefined) return;
    return <Table.Cell key={`table-body-row-cell-${i++}`}>{cell}</Table.Cell>;
  });
};
const renderTableBodyRows = rows => {
  let i = 0;
  if (!rows) {
    return (
      <Table.Row>
        <Table.Cell colSpan="100%" className="text-center">
          No result...
        </Table.Cell>
      </Table.Row>
    );
  }
  return _.map(rows, row => {
    return (
      <Table.Row key={`table-body-row-${i++}`}>{renderCells(row)}</Table.Row>
    );
  });
};
const renderTableHeadRow = heads => {
  return _.map(heads, head => {
    return (
      <Table.HeaderCell key={`table-head-${head}`}>
        <strong>{head}</strong>
      </Table.HeaderCell>
    );
  });
};
export default TableComponent;
