import _ from "lodash";
import React from "react";
import { Field } from "redux-form";
import { Form, Header } from "semantic-ui-react";

/* export const RenderForm = ({ formId, onSubmit, fields }) => {
  return (
    <Form id={formId} onSubmit={handleSubmit(onSubmit)}>
      {RenderFields(fields)}
    </Form>
  );
}; */
export const RenderFields = fields => {
  return _.map(fields, field => {
    const { label, name, component, onChange, type, placeholder } = field;
    return (
      <Field
        key={`hospital-form-field-${name}`}
        label={label}
        name={name}
        component={component}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
      />
    );
  });
};
export const RenderField = field => {
  const { label, input, type, placeholder, meta: { touched, error } } = field;
  return (
    <div>
      <Form.Input
        label={label}
        type={type}
        {...input}
        placeholder={placeholder}
        required
        error={touched && error ? true : false}
      />
      <Header as="h6" color="red" style={{ marginTop: "-10px" }}>
        {touched ? error : ""}
      </Header>
    </div>
  );
};

export const RenderSelectField = field => {
  const {
    required,
    option,
    label,
    input,
    placeholder,
    meta: { touched, error }
  } = field;
  const className = `form-group ${touched && error ? "has-danger" : ""}`;
  return (
    <div className={className}>
      <label>{label}</label>
      <select
        className="form-control"
        {...input}
        placeholder={placeholder.name ? placeholder.name : placeholder}
        required={required}
      >
        {placeholder.name ? (
          <option value={placeholder.id}>{placeholder.name}</option>
        ) : (
          <option value="">{placeholder}</option>
        )}
        {option}
        {placeholder.name ? <option value="">Empty</option> : ""}
      </select>
      <div className="text-help text-danger">{touched ? error : ""}</div>
    </div>
  );
};
export const RenderSelectGroupField = field => {
  const { option, input, placeholder, meta: { touched, error } } = field;
  const className = `pull-left ${touched && error ? "has-danger" : ""}`;
  return (
    <div className={className}>
      <select
        className="form-control"
        {...input}
        placeholder={placeholder.name ? placeholder.name : placeholder}
      >
        <option value={placeholder.id}>{placeholder.name}</option>
        {option}
        <option value="">Empty</option>
      </select>
      <div className="text-help text-danger">{touched ? error : ""}</div>
    </div>
  );
};
export const RenderPhotoField = field => {
  const { input, label } = field;
  return (
    <Form.Input
      label={label}
      type="file"
      accept="image/*"
      onChange={input.onChange}
    />
  );
};

export const FormReset = props => {
  props.reset();
};
