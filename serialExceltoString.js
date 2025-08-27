import XLSX from 'xlsx'

export default function convertirFechaHoraExcel(serial) {
    const fecha = XLSX.SSF.parse_date_code(serial);
    if (!fecha) return null;
        
    const dia = String(fecha.d).padStart(2, '0');
    const mes = String(fecha.m).padStart(2, '0');
    const anio = fecha.y;
    const hora = String(fecha.H).padStart(2, '0');
    const minuto = String(fecha.M).padStart(2, '0');
    const segundo = String(fecha.S).padStart(2, '0');
        
    return `${dia}-${mes}-${anio} ${hora}:${minuto}:${segundo}`;
}