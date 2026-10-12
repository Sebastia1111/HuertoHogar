export const Select = ({
  name,
  value,
  onChange,
  options = [],
  disabled = false,
  placeholder,
  className = ''
}) => {
  return (
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`form-select ${className}`.trim()}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value || opt} value={opt.value || opt}>
          {opt.label || opt}
        </option>
      ))}
    </select>
  );
};