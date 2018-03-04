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
    const {
      label,
      name,
      component,
      onChange,
      type,
      placeholder,
      option,
      group
    } = field;
    return group ? (
      <div key={`hospital-form-field-${name}`}>
        <label>{label}</label>
        <Form.Group widths="three">
          {_.map(group, item => {
            const {
              name,
              label,
              component,
              onChange,
              type,
              placeholder,
              option
            } = item;
            return (
              <Field
                key={`hospital-form-field-group-${name}`}
                label={label}
                name={name}
                component={component}
                onChange={onChange}
                type={type}
                placeholder={placeholder}
                option={option}
              />
            );
          })}
        </Form.Group>
      </div>
    ) : (
      <Field
        key={`hospital-form-field-${name}`}
        label={label}
        name={name}
        component={component}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        option={option}
      />
    );
  });
};
export const RenderField = field => {
  const { label, input, type, placeholder, meta: { touched, error } } = field;
  return (
    <Form.Field>
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
    </Form.Field>
  );
};

export const RenderSelectField = field => {
  const { required, option, label, input, placeholder } = field;
  return (
    <Form.Field
      control="select"
      label={label}
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
    </Form.Field>
  );
};
export const RenderSelectGroupField = field => {
  const { option, input, placeholder } = field;
  return (
    <Form.Field
      {...input}
      control="select"
      placeholder={placeholder.name ? placeholder.name : placeholder}
    >
      <option value={placeholder.id}>{placeholder.name}</option>
      {option}
      <option value="">Empty</option>
    </Form.Field>
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
