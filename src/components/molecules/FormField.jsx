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
    return(
        <div className='campo'>
            {/*Este label sirve para que la pagina lo pueda mostrar, y lo dibujara arriba */}
            {label && <label htmlFor ={name}>{label}</label>}

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
            {pista && <small className ="pista">{pista}</small>}

            {/* Si hay un error, lo dibuja abajo */}
            {error && <small className= "msg-error">{error}</small>}
        </div>
    );
};