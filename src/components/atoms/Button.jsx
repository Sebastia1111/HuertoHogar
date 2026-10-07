
//Con sto indicamos que va a contener el molde y que variables recibira(props)
export const Button = ({children, onClick, type = 'button', variant = 'primario'}) => {
    //children es el texto que ira escrito en el boton
    //onClick: Que funncion se ejecutara cuando el usuario haga clic
    //type: si es un boton normal('button'). o uno por ejemplo para el formulario ('submit')
    //variant: para controlar el color que tiene
    
    return (
        <button
            type = {type}
            className={`btn btn-${variant}`}
            onClick = {onClick}
        >
            {children}
        </button>
    );
};
//className= aplica las clases de CSS originales de HuertoHogar
//{children}: coloca el texto visibl dentro de la etiqueta