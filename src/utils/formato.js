// src/utils/formato.js
// Formatos chilenos para montos y fechas que llegan del backend.

export const dinero = (monto) => `$${Number(monto || 0).toLocaleString('es-CL')}`;

/** "2026-11-21T15:30:00" -> "21-11-2026 15:30" */
export const fechaHora = (iso) => {
  if (!iso) return '';
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return iso;
  return fecha.toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/** "2026-11-21" -> "21-11-2026" (sin pasar por Date para no correr el día por zona horaria) */
export const fechaSimple = (yyyyMmDd) => {
  if (!yyyyMmDd) return '';
  const [anio, mes, dia] = String(yyyyMmDd).split('-');
  return anio && mes && dia ? `${dia}-${mes}-${anio}` : String(yyyyMmDd);
};
