// 1. Seleccionamos los elementos del DOM que vamos a usar
const contenedorCasos = document.getElementById('contenedor-casos');


const spanContador = document.getElementById('contador-casos'); // Para la funcion extra del contador dinamico
const inputBusqueda = document.getElementById('buscar-caso');
const selectAutoridad = document.getElementById('filtro-autoridad');
const btnOrdenar = document.getElementById('btn-ordenar');

// 2. Un arreglo en memoria para guardar los casos durante la sesión
//    (más adelante, como ejercicio, se puede persistir con localStorage)
//MODIFICACIÓN PARA LA LECTURA DEL ALMACENAMIENTO DEL NAVEGADOR
let casos = JSON.parse(localStorage.getItem('mis-casos')) || [];

//Función del contador dinámico ---
function actualizarContador() {
  if (spanContador) {
    spanContador.textContent = casos.length;
  }
}

// 3. Función que construye el HTML de una tarjeta a partir de un caso
function crearTarjetaCaso(caso) {
  const tarjeta = document.createElement('article');
  tarjeta.className = 'tarjeta-caso';

  tarjeta.innerHTML = `
    <h3>${caso.lugar}</h3>
    <p class="meta">${caso.fecha} · ${caso.autoridad}</p>
    <p>${caso.descripcion}</p>
  `;

  return tarjeta;
}

// 4. Función que vuelve a pintar toda la lista de casos
// --- EXTRA Parámetro por defecto para los filtros y validación de página ---
function renderizarCasos(listaAUsar = casos) {
  // Evitamos que falle si estamos en una página que no tiene el contenedor (como reportar.html)
  if (!contenedorCasos) return; 

  contenedorCasos.innerHTML = ''; // limpiamos el contenedor

  if (listaAUsar.length === 0) {
    contenedorCasos.innerHTML = '<p>Aún no hay casos registrados o coincidencias.</p>';
    return;
  }

  listaAUsar.forEach(caso => {
    const tarjeta = crearTarjetaCaso(caso);
    contenedorCasos.appendChild(tarjeta);
  });
}

// 5. Escuchamos el evento "submit" del formulario
if (formulario) {
  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault(); // evita que la página se recargue

    const nuevoCaso = {
      fecha: document.getElementById('fecha').value,
      lugar: document.getElementById('lugar').value,
      descripcion: document.getElementById('descripcion').value,
      autoridad: document.getElementById('autoridad').value,
    };

    casos.push(nuevoCaso);
    
    // --- Guardar en localStorage y contar ---
    localStorage.setItem('mis-casos', JSON.stringify(casos));
    actualizarContador();
    // -------------------------------------------

    renderizarCasos();
    formulario.reset(); // limpia los campos del formulario
  });
}

// 6. Primer render al cargar la página (lista vacía)
renderizarCasos();

//inicializa el contador al entrar a la web ---
actualizarContador();

// =========================================================================
// AGREGADOS AL FINAL (Tarea 2.1 y Funcionalidades Extra 2.2)
// =========================================================================

// --- TAREA 2.1: Búsqueda y Filtro por Autoridad usando filter() ---
function aplicarFiltros() {
  const texto = inputBusqueda.value.toLowerCase();
  const autoridad = selectAutoridad.value;

  const casosFiltrados = casos.filter(caso => {
    const coincideTexto = caso.lugar.toLowerCase().includes(texto) || 
                          caso.descripcion.toLowerCase().includes(texto);
    const coincideAutoridad = autoridad === 'todas' || caso.autoridad === autoridad;
    
    return coincideTexto && coincideAutoridad;
  });

  renderizarCasos(casosFiltrados);
}

// Solo agregamos estos eventos si los campos de filtro existen (en la página casos.html)
if (inputBusqueda && selectAutoridad) {
  inputBusqueda.addEventListener('input', aplicarFiltros);
  selectAutoridad.addEventListener('change', aplicarFiltros);
}

// --- TAREA 2.2: Ordenar por Fecha ---
if (btnOrdenar) {
  btnOrdenar.addEventListener('click', function() {
    // Restamos las fechas convirtiéndolas a Date para ordenar de más reciente a más antiguo
    casos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    // Guardamos el nuevo orden para que se mantenga
    localStorage.setItem('mis-casos', JSON.stringify(casos));
    
    // Si la persona ya había filtrado algo, respetamos su filtro al ordenar
    if (inputBusqueda.value !== '' || selectAutoridad.value !== 'todas') {
      aplicarFiltros();
    } else {
      renderizarCasos();
    }
  });
}

// URL base de la API simulada
const API_URL = 'https://jsonplaceholder.typicode.com/posts';
//OBTENEMOS REFERENCIA AL FORMULARIO ACCEDIENDO AL DOM
const formulario = document.getElementById('form-reporte');

formulario.addEventListener('submit', async function (evento) {
  evento.preventDefault();

  const nuevoCaso = {
    title: document.getElementById('lugar').value,
    body: document.getElementById('descripcion').value,
    autoridad: document.getElementById('autoridad').value,
    fecha: document.getElementById('fecha').value,
  };

  try {
    const respuesta = await fetch(API_URL, {
      method: 'POST',                                 // <-- aquí está la diferencia con GET
      headers: {
        'Content-Type': 'application/json',           // le decimos al servidor qué formato enviamos
      },
      body: JSON.stringify(nuevoCaso),                 // convertimos el objeto JS a texto JSON
    });

    if (!respuesta.ok) {
      throw new Error(`Error al enviar: ${respuesta.status}`);
    }

    const casoConfirmado = await respuesta.json();
    console.log('El servidor respondió con:', casoConfirmado);

    // JSONPlaceholder no guarda datos de verdad, pero SÍ nos devuelve
    // el objeto con un id simulado, como si lo hubiera guardado.
    contenedorCasos.prepend(crearTarjetaCasoDesdeAPI(casoConfirmado));

    formulario.reset();

  } catch (error) {
    alert('Hubo un problema enviando el reporte. Intenta de nuevo.');
    console.error(error);
  }
});

async function obtenerCasosDelServidor() {
  try {
    /** REQUEST AL SERVIDOR DE FORMA ASINCRONA: */
    // fetch() realiza una petición HTTP. Por defecto, el método es GET.
    const response = await fetch(`${API_URL}?_limit=6`);

    // .ok indica si el servidor respondió con un código de éxito (200-299)
    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    // Los datos llegan como texto; .json() los convierte a objetos JavaScript
    const datos = await respuesta.json();
    return datos;

  } catch (error) {
    console.error('No se pudieron obtener los casos:', error);
    return [];
  }
}

function crearTarjetaCasoDesdeAPI(item) {
  const tarjeta = document.createElement('article');
  tarjeta.className = 'tarjeta-caso';
  tarjeta.innerHTML = `
    <h3>Caso #${item.id}</h3>
    <p class="meta">Sincronizado desde el servidor</p>
    <p>${item.title}</p>
  `;
  return tarjeta;
}

async function iniciarListaDesdeServidor() {
  const contenedor = document.getElementById('contenedor-casos');
  contenedor.innerHTML = '<p>Cargando casos del servidor...</p>';

  const casosServidor = await obtenerCasosDelServidor();

  contenedor.innerHTML = '';
  casosServidor.forEach(item => {
    contenedor.appendChild(crearTarjetaCasoDesdeAPI(item));
  });
}

iniciarListaDesdeServidor();