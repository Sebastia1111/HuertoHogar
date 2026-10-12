export  const SelectField = ({

    label,
    name,
    value,
    onChange,
    options = [],
    disable = false,
    error, 
    placeholder = 'Selecciona una opcion'

}) =>{
    return (
        <div className= "mb-3 text-start">
            {label && (
                <label htmlFor ={name} className="form-label text-capitalize fw-bold">
                    {label}
                </label>
            )}
            <select
                id = {name}
                name = {name}
                value ={value}
                onChange = {onChange}
                diable = {disable}
                className = "form-select"
            
            >
                <option value = "">{placeholder}</option>
                {options.map((opt) =>(
                    <option key = {opt.value || opt}value ={opt.value || opt }>
                        {opt.label || opt}
                    </option>
                ))}

            </select>
            {error && <small className = "text-danger d-block mt-1 fw-semibold">{error}</small>}

        </div>
    );
};