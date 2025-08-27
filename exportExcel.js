import XLSX from 'xlsx';

export default function exportExcel(datos) {
    // Crear un nuevo libro
    const workbook = XLSX.utils.book_new();

    // Convertir los datos a hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(datos);

    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hoja1");

    // Guardar el archivo Excel
    XLSX.writeFile(workbook, "Turnos_Desayunos.xlsx");

    console.log("Archivo Excel creado con éxito 🎉");
}

