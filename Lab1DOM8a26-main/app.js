'use strict';

// Declaración de utilidades y referencias
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const estadoUI = $('#estadoUI');
const setEstado = (msg) => { estadoUI.textContent = msg; };
setEstado('Listo');

const btnCambiar= $('#btnCambiarMensaje');
const titulo = $('#tituloPrincipal');
const subtitulo = $('#subtitulo');

// Manejo de eventos
btnCambiar.addEventListener('click', () => {
    const alt = titulo.dataset.alt === '1';

    titulo.textContent = alt
    ? 'Bluee Beatle 18 de Agosto Solo en Cines'
    : '¡A los toxicos los reporto!';

    subtitulo.textContent = alt
    ? '¡No te pierdas la nueva aventura del superhéroe azul!'
    : '¡Prepárate para una experiencia cinematográfica inolvidable!';

    titulo.dataset.alt = alt ? '0' : '1';
    setEstado('Mensaje cambiado');
});

//manejador del evento mouseover de los artículos
const listaArticulos = $('#listaArticulos');

listaArticulos.addEventListener('mouseover', (e) => {
    const card = e.target.closest('.card');
    if (!card)
        return;
    card.classList.add('is-highlight');
});

//manejador del evento mouseout de los artículos
listaArticulos.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.card');
    if (!card)
        return;
    card.classList.remove('is-highlight');
});