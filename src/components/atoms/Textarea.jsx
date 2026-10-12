export const Textarea = ({
  name,
  value,
  onChange,
  rows = 4,
  maxLength = 500,
  placeholder,
  className = ''
}) => {
  return (
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      maxLength={maxLength}
      placeholder={placeholder}
      className={`form-control ${className}`.trim()}
    />
  );
};