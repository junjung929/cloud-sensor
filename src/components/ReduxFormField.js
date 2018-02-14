import React from "react";

export const RenderField = field => {
  const { label, input, type, placeholder, meta: { touched, error } } = field;
  const className = `form-group ${touched && error ? "has-danger" : ""}`;
  return (
    <div className={className}>
      <label>{label}</label>
      <input
        className="form-control"
        type={type}
        {...input}
        placeholder={placeholder}
        required
      />
      <div className="text-help text-danger">{touched ? error : ""}</div>
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
    <div>
      <label>{label}</label>
      <input
        className="form-control"
        type="file"
        accept="image/*"
        onChange={input.onChange}
      />
    </div>
  );
};

export const FormReset = props => {
  props.reset();
};
