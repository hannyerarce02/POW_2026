// Información del portafolio
const portafolio = {

    presentacion:
        "Soy Hannyer Arce Ararat, estudiante de Ingeniería en Sistemas, entusiasta de la programación web. Tengo 21 años y soy de Palmira, Valle del Cauca, Colombia.",

    historialAcademico: [
        "Institución Educativa María Antonia Penagos (Bachillerato)",
        "Universidad Santiago de Cali (Ingeniería en Sistemas - Octavo Semestre)",
        "Técnico en Sistemas - SENA"
    ],

    historialLaboral: [
        "Reparación y mantenimiento de equipos para la Institución Educativa Francisco de Paula Santander (Prácticas del SENA) - 2022",
        "Soluciones de TI para el CD Villa Quindío - 2024"
    ]

};


// Mostrar presentación
document.getElementById("presentacion").textContent =
    portafolio.presentacion;


// Mostrar historial académico
function mostrarAcademico() {

    const lista =
        document.getElementById("historialAcademico");

    lista.innerHTML = "";

    portafolio.historialAcademico.forEach(function (estudio) {

        const elemento =
            document.createElement("li");

        elemento.className =
            "list-group-item";

        elemento.textContent =
            estudio;

        lista.appendChild(elemento);

    });

}


// Mostrar historial laboral
function mostrarLaboral() {

    const lista =
        document.getElementById("historialLaboral");

    lista.innerHTML = "";

    portafolio.historialLaboral.forEach(function (trabajo) {

        const elemento =
            document.createElement("li");

        elemento.className =
            "list-group-item";

        elemento.textContent =
            trabajo;

        lista.appendChild(elemento);

    });

}


// Mostrar información inicial
mostrarAcademico();
mostrarLaboral();


// Agregar formación académica
document
    .getElementById("btnAcademico")
    .addEventListener("click", function () {

        const input =
            document.getElementById("nuevoAcademico");

        const nuevoEstudio =
            input.value.trim();

        if (nuevoEstudio === "") {
            return;
        }

        portafolio.historialAcademico.push(
            nuevoEstudio
        );

        input.value = "";

        mostrarAcademico();

    });


// Agregar experiencia laboral
document
    .getElementById("btnLaboral")
    .addEventListener("click", function () {

        const input =
            document.getElementById("nuevoLaboral");

        const nuevoTrabajo =
            input.value.trim();

        if (nuevoTrabajo === "") {
            return;
        }

        portafolio.historialLaboral.push(
            nuevoTrabajo
        );

        input.value = "";

        mostrarLaboral();

    });