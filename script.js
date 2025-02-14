const app = document.querySelector('#app');
const button = document.querySelector('button');
const input = document.querySelector('input');
function fetchPromise(URL) {
    return fetch(URL)
        .then(response => response.json())
        .catch(error => {
            console.log(error);
            app.innerHTML = 'Oh no! Something went wrong.';
            return null;
        });
}
function createPokemonType(types) {
    return types.map(function (type) {
        return `<div class="type ${type.type.name}">${type.type.name}</div>`;
    }).join('');
}
let offset = 0;
const limit = 36;
let pokemons = JSON.parse(localStorage.getItem('pokemonsData')) || [];
let filteredPokemon = pokemons;
if (pokemons.length) {
    render();
} else {
    fetchPromise("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=898")
        .then(function(value) {
            if (!value || !value.results) {
                console.log('Failed to load Pokémon data');
                return;
            }
            pokemons = value.results;
            filteredPokemon = value.results;
            localStorage.setItem('pokemonsData', JSON.stringify(pokemons));
            render();
        });
}
function upcasefirst(s){
    return s.charAt(0).toUpperCase() + s.slice(1);
}
async function render() {
    const renderLimit = offset + limit;
    for (; offset < renderLimit; offset++) {
        const pokemon = filteredPokemon[offset];
        if (!pokemon) {
            button.style.display = 'none'; 
            break;
        } else {
            button.style.display = 'block';
        }

        try {
            const details = await fetchPromise(pokemon.url); 
            if (!details) continue; 
            const typesHTML = createPokemonType(details.types);
            const pokemonID = details.id; 
            const pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonID}.png`;
            const div = document.createElement('div');
            div.classList.add('pokemon-item');
            div.innerHTML = `
                <div class="pokemon-id">#${pokemonID}</div>
                <img class="pokemon-image" src="${pokemonImage}" alt="${pokemon.name}">
                <h3>${upcasefirst(pokemon.name)}</h3>
                <div class="type">${typesHTML}</div>
            `;
            app.appendChild(div);
        } catch (error) {
            console.log(error);
            app.innerHTML = 'Oh no! Something went wrong.';
        }
    }
}
button.addEventListener('click', render);
function boldText(text) {
    return `<b>${text}</b>`;
}

function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
input.addEventListener("focus", function() {
    input.style.border = "1px solid #000000"; // Đặt màu viền khi focus vào ô input
});

input.addEventListener("blur", function() {
    input.style.border = ""; 
});

input.addEventListener('input', function () {
    offset = 0;
    app.innerHTML = ''; 
    filteredPokemon = pokemons.filter(function (pokemon) {
        return pokemon.name.includes(input.value.toLowerCase());
    });

    if (!filteredPokemon.length) {
        const escapedInput = escapeHTML(input.value);
        const bordersearch = boldText(escapedInput); 
        app.innerHTML = `<p>No Pokémon matched with "${bordersearch}".</p>`;
        button.style.display = 'none';
    } else {
        button.style.display = 'block';
        render();
    }
});








