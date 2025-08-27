import limpiarReporte from './analizarReporte.js'
import { desayunosDiaUno, desayunosDiaDos} from './analizarTurnos.js';
import combinados from './combinar.js';
import exportExcel from './exportExcel.js';

export default function generar(){

const reporteDesayuno = "uploads/reporte.xls"
const inicioDesayuno = 16; 

const datosReporte = limpiarReporte(reporteDesayuno, inicioDesayuno); 

//console.log(datosReporte)

// Limpiar Listado de Turnos
const reporteTurno = "uploads/turnos.xls"
const inicioTurno = 4; 

const datosTurnosDiaUno = desayunosDiaUno(reporteTurno, inicioTurno);
const datosTurnosDiaDos = desayunosDiaDos(reporteTurno, inicioTurno);

//console.log(datosTurnosDiaUno);
//console.log(datosTurnosDiaDos);

// Combinar Listado de Turnos y Reporte de Desayunos

const combinado = combinados(datosReporte, datosTurnosDiaUno, datosTurnosDiaDos);

// Pasar a excel

 exportExcel(combinado);
}

