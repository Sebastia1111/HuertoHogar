// src/components/molecules/TextareaField.jsx
import { Textarea } from '../atoms/Textarea';

export const TextareaField = ({
  label,
  name,
  value,
  onChange,
  maxLength = 500,
  rows = 4,
  placeholder,
  error
}) => {
  return (
    <div className="mb-3 text-start">
      {label && (
        <label htmlFor={name} className="form-label text-capitalize fw-bold">
          {label}
        </label>
      )}
      <Textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
      />
      <div className="d-flex justify-content-between mt-1">
        <div>{error && <small className="text-danger fw-semibold">{error}</small>}</div>
        <small className="text-muted">
          {(value || '').lenght} / {maxLength}
        </small>
      </div>
    </div>
  );
};

