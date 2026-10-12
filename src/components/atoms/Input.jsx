export const Input = ({
    type = 'text',
    name,
    value,
    onChange,
    placeholder,
    required = false,
    className = ''

}) => {
//se crea el molde
//type: define si sera un texto normal o correo ('email') o es una clave oculta ('password')
//name: el nombre identificador del camplo ejempl "correo" o "rut"
//value: lo que esta escrito dentro del cuadro
//onChange: la funcion que se activa en vivo cada vez que el usuario presiona una tecla
//placeholder: EL texto gris de ayuda que se ve al estar vacio
//required: indica si el campo es obligatorio(true o false)
    return (
        <input
            type = {type}
            id = {name}
            name = {name}
            value = {value}
            onChange = {onChange}
            placeholder = {placeholder}
            required = {required}
            className = {`input-control ${className}`.trim()}
        />
    )
}
