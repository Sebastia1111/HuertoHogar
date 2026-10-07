export const Heading = ({level = 2, children, className = ''}) => {
    const Tag = `h${level}`;
    return <Tag className={`titulo-seccion ${className}`.trim()}>{children}</Tag>;
};
//con level se controla el tipo de texto si es h1 level=1 y si es h2 level=2
//Tag cambia el tipo de etiqueta de manera automatica


export const Text = ({children, className = ''}) => {
    return <p className={`texto-cuerpo ${className}`.trim()}>{children}</p>;
};
