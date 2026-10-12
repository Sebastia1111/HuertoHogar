import { Select } from "../atoms/Select";

export  const SelectField = ({

    label,
    name,
    value,
    onChange,
    options = [],
    disabled = false,
    error, 
    placeholder

}) =>{
    return (
        <div className= "mb-3 text-start">
            {label && (
                <label htmlFor ={name} className="form-label text-capitalize fw-bold">
                    {label}
                </label>
            )}
            <Select
                name = {name}
                value ={value}
                onChange={onChange}
                options={options}
                disabled={disabled}
                placeholder={placeholder}
            />
            {error && <small className="text-danger d-block mt-1 fw-semibold">{error}</small>}
        </div>
    );
};