import React, { Component } from "react";

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
  const { required, option, label, input, placeholder, meta: { touched, error } } = field;
  const className = `form-group ${touched && error ? "has-danger" : ""}`;
  return (
    <div className={className}>
      <label>{label}</label>
      <select
        className="form-control"
        {...input}
        placeholder={placeholder}
        required={required}
      >
        <option value="">{placeholder}</option>
        {option}
      </select>
      <div className="text-help text-danger">{touched ? error : ""}</div>
    </div>
  );
};
export const RenderPhotoField = field => {
  const { input, label, onChange } = field;
  return (
    <div>
      <label>{label}</label>
      <input className="form-control" type="file" onChange={input.onChange} />
    </div>
  );
};
