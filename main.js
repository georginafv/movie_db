// Variable global para almacenar todas las películas
let allMovies = []; 

document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3000/") 
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(movies => {
        allMovies = movies; // Guardamos la lista completa
        
        // 1. Inicializar la tabla y los filtros
        renderTable(allMovies);
        populateFilters(allMovies);

        // 2. Escuchar los cambios en los filtros
        document.getElementById('genreFilter').addEventListener('change', applyFilters);
        document.getElementById('yearFilter').addEventListener('change', applyFilters);

    }).catch(err => {
        console.error('Error cargando películas:', err);
        document.body.innerHTML += `<p style="color: red; text-align: center;">Error al cargar los datos: ${err.message}.</p>`;
    });
});

/**
 * Función para dibujar la tabla de películas
 * @param {Array} moviesToRender - El array de películas a mostrar
 */
function renderTable(moviesToRender) {
    const tbody = document.querySelector("#moviesTable tbody");
    if (!tbody) return;

    // Limpiar el contenido anterior de la tabla
    tbody.innerHTML = ''; 

    moviesToRender.forEach(movie => {
        const row = document.createElement('tr');
        
        // --- CELDA DE PORTADA (IMAGEN + HIPERVÍNCULO) ---
        const coverCell = document.createElement('td');
        const coverLink = document.createElement('a');
        coverLink.href = `/detalle/${movie.id}`; 
        coverLink.title = `Ver detalles de ${movie.titulo}`; 

        const coverImg = document.createElement('img');
        coverImg.src = movie.portada;
        // Si la portada es una URL rota, muestra el texto alternativo
        coverImg.onerror = function() {
            this.onerror = null; // Evita bucle infinito si la imagen alternativa falla
            this.style.width = '80px'; 
            this.style.height = '80px';
            this.style.border = '1px dashed #fff';
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            this.outerHTML = `<div class="movie-cover" style="height: 80px; line-height: 80px;">Portada Rota</div>`;
        };
        coverImg.alt = `Portada de ${movie.titulo}`;
        coverImg.className = "movie-cover"; 
        
        coverLink.appendChild(coverImg);
        coverCell.appendChild(coverLink);
        row.appendChild(coverCell);

        // --- RESTO DE CELDAS ---
        const movieData = [
            movie.titulo,
            movie.genero,
            movie.anio_creacion,
            movie.director,
            movie.duracion_min + ' min', 
            movie.detalle
        ];

        movieData.forEach(data => {
            const cell = document.createElement('td');
            cell.textContent = data;
            row.appendChild(cell);
        });
        
        tbody.appendChild(row);
    });
}

/**
 * Función que carga los valores únicos de género y año en los selectores.
 * @param {Array} movies - El array completo de películas.
 */
function populateFilters(movies) {
    const genreFilter = document.getElementById('genreFilter');
    const yearFilter = document.getElementById('yearFilter');

    // Usar Set para obtener valores únicos y ordenarlos
    const uniqueGenres = [...new Set(movies.map(movie => movie.genero))].sort();
    const uniqueYears = [...new Set(movies.map(movie => movie.anio_creacion))].sort((a, b) => b - a); // Ordenar de más nuevo a más viejo

    // Llenar Géneros
    uniqueGenres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });

    // Llenar Años
    uniqueYears.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
}

/**
 * Función principal de filtrado que se ejecuta al cambiar un selector.
 */
function applyFilters() {
    const selectedGenre = document.getElementById('genreFilter').value;
    const selectedYear = document.getElementById('yearFilter').value;

    // Aplicar filtros a la lista completa (allMovies)
    const filteredMovies = allMovies.filter(movie => {
        const matchesGenre = selectedGenre === 'all' || movie.genero === selectedGenre;
        // Convertir el valor del año a string para comparar con 'all'
        const matchesYear = selectedYear === 'all' || String(movie.anio_creacion) === selectedYear;

        return matchesGenre && matchesYear;
    });

    // Redibujar la tabla con las películas filtradas
    renderTable(filteredMovies);
}