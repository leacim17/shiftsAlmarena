import XLSX from 'xlsx'

export default function limpiarReporte (reporte, inicio){
    //Traemos el reporte en cuestion
    const workbook = XLSX.readFile(reporte);

    //Traemos la hoja del reporte
    const hoja = workbook.Sheets[workbook.SheetNames[0]];

    //Extraemos los datos y los ponemos en un array
    let datos = XLSX.utils.sheet_to_json(hoja, { header: 1 });

    const fin = datos.findIndex(word => word.includes("Cantidad de Habitaciones"));

    datos = datos.slice(inicio, fin-1).map(fila => {
        let pax = fila[10] + fila[12] + fila [14];
        return [fila[0], fila[4], pax];
    })

    return datos; 
}