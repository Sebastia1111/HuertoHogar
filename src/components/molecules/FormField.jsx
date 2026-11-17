import {Input} from '../atoms/Input';

export const FormField = ({

    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    pista,
    error
    

}) => {
    return(//mb-3 da un espacio inferior estandar de bootstrap entre campos
        <div className="mb-3 text-start">
            {/*Este label sirve para que la pagina lo pueda mostrar, y lo dibujara arriba */}
            {label && <label htmlFor ={name} className='form-label text-capitalize fw-bold'>{label}</label>}

            {/*Aqui se usa el atomo input */}
            <Input 
                type = {type}
                name = {name}
                value = {value}
                onChange = {onChange}
                placeholder = {placeholder}
                required = {required}
            />
            {/* Si mandamos una pista, la dibuja abajo */}
            {pista && <small className = "form-text text-muted d-block mt-1">{pista}</small>}

            {/* Si hay un error, lo dibuja abajo */}
            {error && <small className = "text-danger d-block mt-1 fw-semibold">{error}</small>}
        </div>
    );
};