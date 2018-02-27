import React from "react";
import { Content as ContentStyle } from "./styles";
import { Icon, Button } from "semantic-ui-react";
import { Table } from "../../components";

export const Content = ({ tHead, tBody, pages, onAddClick, onPageChange }) => {
  return (
    <ContentStyle>
      <Button icon color="blue" labelPosition="left" onClick={onAddClick}>
        <Icon name="plus" />
        Add
      </Button>
      <div className="divisionLine" />
      <Table
        onPageChange={onPageChange}
        tableHeadRow={tHead}
        tableBody={tBody}
        pages={pages}
      />
    </ContentStyle>
  );
};
