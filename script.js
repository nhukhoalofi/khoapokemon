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
const limit = 20;
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
// Hàm render hiển thị danh sách Pokémon
async function render() {
    const renderLimit = offset + limit;
    for (; offset < renderLimit; offset++) {
        const pokemon = filteredPokemon[offset];
        if (!pokemon) {
            button.style.display = 'none'; // Ẩn nút nếu hết Pokémon
            break;
        } else {
            button.style.display = 'block'; // Hiển thị nút nếu còn Pokémon
        }

        // Lấy URL ảnh Pokémon
        const pokemonImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${offset + 1}.png`;

        try {
            const details = await fetchPromise(pokemon.url); // Đợi dữ liệu từ API
            if (!details) continue; // Nếu lỗi, bỏ qua Pokémon này

            const typesHTML = createPokemonType(details.types);

            // Tạo HTML cho mỗi Pokémon
            const div = document.createElement('div');
            div.classList.add('pokemon-item');
            div.innerHTML = `
                <div class="pokemon-id">#${offset + 1}</div>
                <img class="pokemon-image" src="${pokemonImage}" alt="${pokemon.name}">
                <h3>${upcasefirst(pokemon.name)}</h3>
                <div class="type">${typesHTML}</div>
                </div>
            `;
            app.appendChild(div);
        } catch (error) {
            console.log(error);
            app.innerHTML = 'Oh no! Something went wrong.';
        }
    }
}


button.addEventListener('click', render);

input.addEventListener('input', function() {
    offset = 0;
    app.innerHTML = ''; 
    filteredPokemon = pokemons.filter(function(pokemon) {
        return pokemon.name.includes(input.value.toLowerCase());
    });

    if (!filteredPokemon.length) {
        app.innerHTML = '<p>No Pokémon found.</p>';
        button.style.display = 'none';
    } else {
        button.style.display = 'block';
        render(); 
    }
});