import React from "react";
import { Icon, Button, Modal, Image, Loader, List } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Table } from "../../components";
import { LinkStyle } from "./styles";

const WhiteImg = require("../../assets/white-image.png");

export const TalbeContent = ({ tHead, tBody, pages, onPageChange }) => {
  return (
    <Table
      onPageChange={onPageChange}
      tableHeadRow={tHead}
      tableBody={tBody}
      pages={pages}
    />
  );
};
export const ModalContent = ({
  open,
  header,
  src,
  content,
  formId,
  mode,
  onCancelClick,
  basic
}) => {
  return (
    <Modal open={open}>
      <Modal.Header>{header}</Modal.Header>
      <Modal.Content image scrolling>
        {src === "none" ? null : (
          <Image
            src={src ? src : String(WhiteImg)}
            rounded
            size="medium"
            wrapped
          />
        )}
        <Modal.Description>{content}</Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        {basic ? null : (
          <Button
            primary
            type="submit"
            form={formId}
            icon
            labelPosition="right"
          >
            <Icon name="check" />
            Confirm
          </Button>
        )}
        <Button
          type="button"
          icon
          labelPosition="right"
          negative
          onClick={onCancelClick}
        >
          <Icon name="cancel" />
          {basic ? "Close" : "Cancel"}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export const DeleteModal = ({ onCancelClick, onConfirmClick, name, open }) => {
  return (
    <Modal basic size="small" open={open}>
      <Modal.Header as="h2" className="text-center">
        <Icon name="warning circle" />Warning
      </Modal.Header>
      <Modal.Content>
        <p>
          This behaviour will also affect all information which is child
          components of {name}.
        </p>
        <p>Are you sure to delete?</p>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color="red" inverted onClick={onCancelClick}>
          <Icon name="remove" /> No
        </Button>
        <Button color="green" inverted onClick={onConfirmClick}>
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export const LoaderModal = ({
  trigger,
  response,
  onCancelClick,
  open,
  err
}) => {
  let content;
  if (response === "SUCCESS") {
    content = {
      icon: "check circle outline",
      header: "Success!",
      content: "Successfully done!"
    };
  } else if (response === "FAIL") {
    content = {
      icon: "warning circle",
      header: "Fail",
      content: "Please try again."
    };
  }
  return (
    <Modal
      basic
      dimmer={true}
      open={open}
      closeOnEscape={false}
      closeOnRootNodeClick={false}
      size="small"
    >
      {response ? (
        <Modal.Header as="h2" className="text-center">
          <Icon name={content.icon} />
          {content.header}
        </Modal.Header>
      ) : null}
      {response ? (
        <Modal.Content className="text-center">
          <p>{content.content}</p>
        </Modal.Content>
      ) : (
        <Loader active>
          <h3>Please wait</h3>
          <p>Processing</p>
        </Loader>
      )}
      {response ? (
        <Modal.Actions>
          <Button icon="check" content="Close" onClick={onCancelClick} />
        </Modal.Actions>
      ) : null}
    </Modal>
  );
};

export const RenderList = ({
  listItems,
  pages,
  page,
  onClickPrev,
  onClickNext,
  size,
  btnSize
}) => {
  return (
    <List size={size}>
      {listItems}
      {Math.ceil(pages) > 1 ? (
        <ButtonGroup
          size={btnSize}
          onClickPrev={onClickPrev}
          onClickNext={onClickNext}
          page={page}
          pages={pages}
        />
      ) : null}
    </List>
  );
};

export const RenderListItem = ({
  id,
  item,
  url,
  to,
  onItemClick,
  header,
  items
}) => {
  const path = `${url}/${to}=${id}`;
  return (
    <List.Item style={{ textAlign: "left" }}>
      <Link to={path} onClick={() => onItemClick}>
        <LinkStyle>
          <List>{header}</List>
        </LinkStyle>
      </Link>
      {items}
    </List.Item>
  );
};
const ButtonGroup = ({ onClickPrev, onClickNext, page, pages, size }) => {
  return (
    <Button.Group
      color="teal"
      inverted
      size={size}
      className="pull-right"
      style={{ margin: "10px" }}
    >
      <Button
        icon="angle left"
        disabled={page > 0 ? false : true}
        onClick={onClickPrev}
      />
      <Button
        icon="angle right"
        disabled={page + 1 < Math.ceil(pages) ? false : true}
        onClick={onClickNext}
      />
    </Button.Group>
  );
};
