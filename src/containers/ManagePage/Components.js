import React from "react";
import { Icon, Button, Modal, Image, Loader } from "semantic-ui-react";
import { Table } from "../../components";
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
  onCancelClick
}) => {
  return (
    <Modal open={open}>
      <Modal.Header>{header}</Modal.Header>
      <Modal.Content image scrolling>
        <Image
          src={src ? src : String(WhiteImg)}
          rounded
          size="medium"
          wrapped
        />
        <Modal.Description>{content}</Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button primary type="submit" form={formId} icon labelPosition="right">
          <Icon name="check" />
          Confirm
        </Button>
        <Button
          type="button"
          icon
          labelPosition="right"
          negative
          onClick={onCancelClick}
        >
          <Icon name="cancel" />Cancel
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
      icon: "warning circlee",
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
