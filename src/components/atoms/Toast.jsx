// src/components/atoms/Toast.jsx
export const Toast = ({ mensaje }) => {
  if (!mensaje) return null;

  return (
    <div
      className="position-fixed start-50 translate-middle-x bg-dark text-white px-4 py-3 rounded-3 shadow-lg"
      style={{ bottom: '30px', zIndex: 2000, maxWidth: '90vw', fontSize: '14.5px' }}
    >
      {mensaje}
    </div>
  );
};