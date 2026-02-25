'use strict';

// =============================
// UTILIDADES
// =============================
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// =============================
// CREAR CARDS DINÁMICAS
// =============================
const buildCard = ({ title, text, tags }) => {
    const article = document.createElement('article');
    article.className = 'card';
    article.dataset.tags = tags;

    article.innerHTML = `
        <h3 class="card-title"></h3>
        <p class="card-text"></p>
        <div class="card-actions">
            <button class="btn small" type="button" data-action="like">👍 Like</button>
            <button class="btn small ghost" type="button" data-action="remove">Eliminar</button>
            <span class="badge" aria-label="likes">0</span>
        </div>
    `;

    article.querySelector('.card-title').textContent = title;
    article.querySelector('.card-text').textContent = text;

    return article;
};

// =============================
// ESTADO UI
// =============================
const estadoUI = $('#estadoUI');
const setEstado = msg => estadoUI.textContent = msg;
setEstado('Listo');

// =============================
// CAMBIAR MENSAJE
// =============================
const btnCambiar = $('#btnCambiarMensaje');
const titulo = $('#tituloPrincipal');
const subtitulo = $('#subtitulo');

btnCambiar.addEventListener('click', () => {
    const alt = titulo.dataset.alt === '1';

    titulo.textContent = alt
        ? 'Haz sido troleado por JavaScript'
        : 'Bienvenido a la aplicación de ejemplo';

    subtitulo.textContent = alt
        ? '¡Sorpresa! Este es un mensaje alternativo.'
        : 'Esta es una aplicación sencilla para demostrar manipulación del DOM.';

    titulo.dataset.alt = alt ? '0' : '1';
    setEstado('Textos actualizados');
});

// =============================
// HOVER HIGHLIGHT
// =============================
const listaArticulos = $('#listaArticulos');

listaArticulos.addEventListener('mouseover', e => {
    const card = e.target.closest('.card');
    if (card) card.classList.add('is-highlight');
});

listaArticulos.addEventListener('mouseout', e => {
    const card = e.target.closest('.card');
    if (card) card.classList.remove('is-highlight');
});

// =============================
// AGREGAR CARD
// =============================
const btnAgregarCard = $('#btnAgregarCard');

btnAgregarCard.addEventListener('click', () => {
    const article = buildCard({
        title: 'Nueva Card',
        text: 'Esta card fue agregada dinámicamente.',
        tags: 'nueva dinamica'
    });

    listaArticulos.append(article);
    setEstado('Nueva card agregada');
});

// =============================
// LIMPIAR CARDS DINÁMICAS
// =============================
const btnLimpiar = $('#btnLimpiar');

btnLimpiar.addEventListener('click', () => {
    const cards = $$('#listaArticulos .card');
    let removed = 0;

    cards.forEach(card => {
        if (card.dataset.seed === 'true') return;
        card.remove();
        removed++;
    });

    setEstado(`Se eliminaron ${removed} cards`);
});


// LIKE + ELIMINAR LIKES

listaArticulos.addEventListener('click', e => {

    const btnLike = e.target.closest('button[data-action="like"]');
    if (btnLike) {
        const card = btnLike.closest('.card');
        hacerLike(card);
        return;
    }

    const btnRemove = e.target.closest('button[data-action="remove"]');
    if (btnRemove) {
        const card = btnRemove.closest('.card');
        eliminarLikes(card);
        return;
    }
});

// Toggle Like
const hacerLike = card => {
    const badge = card.querySelector('.badge');
    const btn = card.querySelector('[data-action="like"]');

    let likes = Number(badge.textContent) || 0;

    if (btn.classList.contains('liked')) {
        likes = Math.max(0, likes - 1);
        btn.classList.remove('liked');
        btn.textContent = '👍 Like';
        setEstado('Like removido');
    } else {
        likes++;
        btn.classList.add('liked');
        btn.textContent = '💖 Liked';
        setEstado('Like agregado');
    }

    badge.textContent = likes;
};

// Reiniciar likes
const eliminarLikes = card => {
    const badge = card.querySelector('.badge');
    const btn = card.querySelector('[data-action="like"]');

    badge.textContent = 0;
    btn.classList.remove('liked');
    btn.textContent = '👍 Like';

    setEstado('Likes eliminados');
};


//filtrar cards

const filtro = $('#filtro');

const filterState = {q: '', tag:''};

const matchText = (card, q) => {
    const title = card.querySelector('.card-title')?.textContent ?? '';
    const text = card.querySelector('.card-text')?.textContent ?? '';
    const haystack = (title + ' ' + text).toLowerCase();
    return haystack.includes(q);
};

const matchTag = (card, tag) => {
    if (!tag) return true; //si no hay tag, coinciden todos lasa tags
    const tags = (card.dataset.tags || '').toLowerCase();
    return tags.includes(tag.toLowerCase());
};

const applyFilters = () =>{
    const cards = $$('#listaArticulos .card');
    cards.forEach((card) => {
        const okText = filterState.q
        ? matchText(card, filterState.q)
        : true;
        const okTag = matchTag(card, filterState.tag);
        card.hidden = !(okText && okTag);
    });
    const parts =[];
    if (filterState.q) parts.push(`Texto: ""${filterState.q}`);
    if (filterState.tag) parts.push(`Tag: "${filterState.tag}"`);
    setEstado(parts.length
        ? `Filtro aplicados (${parts.join('')})`
        : 'Filtro vacio');
};

filtro.addEventListener('input', () => {
    const q = filtro.value.trim().toLowerCase();
    const cards = $$('#listaArticulos .card');

    cards.forEach(card => {
        const ok = q === '' ? true : matchText(card, q);
        card.hidden = !ok;
    });

    setEstado(q === '' ? 'Filtro vacío' : `Filtro texto: "${q}"`);

});

// filtrar por tags
const chips = $('#chips');

chips.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return; // no se hizo clic en un chip

    const tag = (chip.dataset.tag || '').toLowerCase();
    const cards = $$('#listaArticulos .card');

    cards.forEach(card => {
        const cardTags = (card.dataset.tags || '').toLowerCase();
        card.hidden = !cardTags.includes(tag);
    });

    setEstado(`Filtro por tag: "${tag}"`);
});

//para validar el formulario de suscripcion
const form = $('#formNewsletter');
const email = $('#email');
const interes = $('#interes');
const feedback = $('#feedback');
 
//validar con email con una expresion regular simple
const isValidEmail = (value) => /^[^\s@]+@+[^\s@]+\.[^\s@]+$/.test(value);

form.addEventListener('submit', (e) => {
    //evitar el envio del formulario
    e.preventDefault();
    const valueEmail = email.value.trim();
    const valueInteres = interes.value.trim();

    email.classList.remove('is-invalid');
    interes.classList.remove('is-invalid');
    feedback.textContent = '';

    let ok = true;
    if(!isValidEmail(valueEmail)){
        email.classList.add('is-invalid');
        ok = false;
    }
    if(!valueInteres) {
        interes.classList.add('is-invalid');
        ok = false;
    }
    if (!ok) {
        feedback.textContent = 'Revisar los campos marcados como invalidos.';
        setEstado('Formulario con datos no validos');
        return;
    }
});

//simulacion de carga asincrona de noticias
const listaNoticias = $('#listaNoticias');

const renderNoticias = (items) => {
    listaNoticias.innerHTML = '';

    if (!items || items.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No hay noticias disponibles.';
        listaNoticias.append(li);
        return;
    }

    items.forEach((t) => {
        const li = document.createElement('li');
        li.textContent = t;
        listaNoticias.append(li);
    });

};
