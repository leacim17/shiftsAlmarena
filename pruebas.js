import convertirFechaHoraExcel from './serialExceltoString.js';

export default function combinados(datosReporte, datosTurnos){
    let combinado = []; 
    let sinTurn = new Set();
    datosReporte.forEach(filaReporte => {
        datosTurnos.forEach(filaTurnos => {
            //Si tiene turno
            if(filaTurnos[5] === filaReporte[0]){
                const nuevaFila = [filaTurnos[2], filaTurnos[0], filaTurnos[1], filaTurnos[3], filaTurnos[4], filaTurnos[5]]
                combinado.push(nuevaFila);
            }else if(filaTurnos[5] !== filaReporte[0]){
                const nuevaFila = [0, "DESAYUNO", "SIN TURNO", filaReporte[2], filaReporte[1], filaReporte[0]]
                combinado.push(nuevaFila);
            }
        });
    });
    combinado.sort((a, b) => a[0] - b[0]);
    combinado.forEach(fila =>{
        fila[0] = convertirFechaHoraExcel(fila[0]);
    })
    return combinado;
}
