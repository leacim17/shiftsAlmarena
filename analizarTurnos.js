import XLSX from 'xlsx'
import convertirFechaHoraExcel from './serialExceltoString.js';

function obtenerDiaDeManana(sumarDia) {
  // Obtener fecha y hora actuales en Argentina
  const ahora = new Date();
  const ahoraArgentina = new Date(
    ahora.toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" })
  );

  // Sumar un día
  ahoraArgentina.setDate(ahoraArgentina.getDate() + sumarDia);

  // Formatear en YYYY-MM-DD
  const yyyy = ahoraArgentina.getFullYear();
  const mm = String(ahoraArgentina.getMonth() + 1).padStart(2, "0");
  const dd = String(ahoraArgentina.getDate()).padStart(2, "0");

  return `${dd}-${mm}-${yyyy}`;
}

console.log(obtenerDiaDeManana(0));


function limpiarTurnos (reporte, inicio){
    //Traemos el reporte en cuestion
        const workbook = XLSX.readFile(reporte);
    
        //Traemos la hoja del reporte
        const hoja = workbook.Sheets[workbook.SheetNames[0]];
    
        //Extraemos los datos y los ponemos en un array
        let datos = XLSX.utils.sheet_to_json(hoja, { header: 1 });
    
        const fin = datos.findIndex(word => word.includes("Page"));

        function checkAccion(accion){
            if(accion == undefined){
                return "en NOI";
            }else{
                return accion; 
            }
        }
    
        datos = datos.slice(inicio, fin-1).map(fila => {
            //let fecha = convertirFechaHoraExcel(fila[3]);
            let accion = checkAccion(fila[2]);
            return [fila[0], accion, fila[3], fila[4], fila[5], fila[8]]; 
        })
    
        return datos; 
}

export function desayunosDiaUno(reporte, inicio){
    const datos = limpiarTurnos(reporte, inicio)
    const diaUno = obtenerDiaDeManana(1);
    console.log(diaUno)
     return datos.filter(fila => {
        const fechaConvertida = convertirFechaHoraExcel(fila[2]);
        let [fecha, hora] = fechaConvertida.split(" ");
        return fecha == diaUno;
    });
}

export function desayunosDiaDos(reporte, inicio){
    const datos = limpiarTurnos(reporte, inicio)
    let diaDos = obtenerDiaDeManana(2);
    console.log(diaDos)
     return datos.filter(fila => {
        const fechaConvertida = convertirFechaHoraExcel(fila[2]);
        let [fecha, hora] = fechaConvertida.split(" ");
        return fecha == diaDos;
    });
}