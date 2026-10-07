export const Badge = ({children, variant = 'verde', className = ''})=>{
    return (
        <span className={`badge badge-${variant}${className}`.trim()}>
            {children}
        </span>
    );
};