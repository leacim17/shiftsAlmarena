import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import generar from "./generarArchivo.js";

const app = express();

// Middleware para servir archivos estáticos (HTML, CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, "public")));

// Ruta principal (opcional, porque express.static ya devuelve index.html automáticamente)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Puerto dinámico (Render lo define en process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Aquí se asigna nombre fijo según el fieldname
    if (file.fieldname === 'reporte') {
      cb(null, 'reporte.xls');
    } else if (file.fieldname === 'turnos') {
      cb(null, 'turnos.xls ');
    } else {
      cb(null, file.originalname);
    }
  }
});

const upload = multer({ storage });

// Ruta que recibe los archivos
app.post(
  "/upload",
  upload.fields([
    { name: "reporte", maxCount: 1 },
    { name: "turnos", maxCount: 1 },
  ]),
  (req, res) => {
    console.log("Archivos recibidos:", req.files);

    // Ejemplo de acceso:
    // req.files.breakfast_report[0].path → ruta donde quedó guardado
    // req.files.shifts_list[0].path → ruta donde quedó guardado

    generar();

     // Supongamos que querés devolver un Excel generado o un PDF
  const filePath = "Turnos_Desayunos.xlsx";

  res.download(filePath, "Turnos_Desayunos.xlsx", (err) => {
    if (err) {
      console.error("Error al enviar archivo:", err);
      res.status(500).send("Error al generar la descarga");
    }
  });
  }
);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});








// Limpiar Reporte de Desayunos 
/*import limpiarReporte from './analizarReporte.js'
import { desayunosDiaUno, desayunosDiaDos} from './analizarTurnos.js';
import combinados from './combinar.js';
import exportExcel from './exportExcel.js';

const reporteDesayuno = "G001/reporte.xls"
const inicioDesayuno = 16; 

const datosReporte = limpiarReporte(reporteDesayuno, inicioDesayuno); 

//console.log(datosReporte)

// Limpiar Listado de Turnos
const reporteTurno = "turnos/turnos.xls"
const inicioTurno = 4; 

const datosTurnosDiaUno = desayunosDiaUno(reporteTurno, inicioTurno);
const datosTurnosDiaDos = desayunosDiaDos(reporteTurno, inicioTurno);

//console.log(datosTurnosDiaUno);
//console.log(datosTurnosDiaDos);

// Combinar Listado de Turnos y Reporte de Desayunos

const combinado = combinados(datosReporte, datosTurnosDiaUno, datosTurnosDiaDos);

// Pasar a excel
exportExcel(combinado);

console.log(combinado)
*/
