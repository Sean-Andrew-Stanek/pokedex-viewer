

const pokemonTypeList = [
    'water',
    'normal',
    'fire',
    'grass',
    'electric',
    'ice',
    'fighting',
    'poison',
    'ground',
    'flying',
    'psychic',
    'bug',
    'rock',
    'ghost',
    'dragon',
    'dark',
    'steel',
    'fairy',
];

document.getElementById("submit-button").addEventListener("click", function(event){
    event.preventDefault();
});

/* Adds options to the NavMenu->Types */
// eslint-disable-next-line no-unused-vars
let createDropdownOptions = (function () {
    let typeFilterRoot = document.querySelector('#filter-by-type');

    /* iterates through the type-list above (pokemonTypeList) */
    for (let i = 0; i < pokemonTypeList.length; i++) {
        let anchor = document.createElement('a');
        anchor.setAttribute('href', '#');
        anchor.setAttribute(
            'onclick',
            "pokemonRepository.filterPokemon('" +
                pokemonTypeList[i].slice(0, 1) +
                pokemonTypeList[i].slice(1) +
                "')"
        );

        anchor.classList.add('dropdown-item');
        anchor.innerHTML =
            pokemonTypeList[i].slice(0, 1).toUpperCase() +
            pokemonTypeList[i].slice(1);

        let listItem = document.createElement('li');
        listItem.append(anchor);

        typeFilterRoot.append(listItem);
    }
})();

/* Functions to show:
    Loading Modal
    Pokemon Details Modal */
let modalManager = (function () {
    /* Will add details from pokemon parameter */
    function showModal(pokemon) {
        let modalBody = document.querySelector('#pokemon-details');
        let modalTitle = document.querySelector('#pokemon-name');

        /* Clear Previous HTML */
        modalTitle.innerHTML = '';
        modalBody.innerHTML = '';

        let nameElement = document.createElement('h1');
        nameElement.innerHTML = pokemon.name;

        /* Adds current details */
        let typesElement = document.createElement('p');
        typesElement.innerHTML = 'type: ' + pokemon.types[0].type.name;
        if (pokemon.types.length > 1)
            typesElement.innerHTML += ' / ' + pokemon.types[1].type.name;
        let idElement = document.createElement('p');
        idElement.innerHTML = 'National Pokedex ID: ' + pokemon.id;

        /* Adds Modal Image Holder */
        let imageHolder = document.createElement('div');
        imageHolder.classList.add(pokemon.types[0].type.name.toLowerCase());
        imageHolder.classList.add('modal-image-holder');

        /* Adds Modal Image */
        let imageElement = new Image();
        imageElement.src = pokemon.imageURL;
        imageElement.alt = "Picture of " + pokemon.name;
        imageElement.classList.add('modal-image');
        imageHolder.appendChild(imageElement);


        modalTitle.append(nameElement);
        modalBody.append(imageHolder);
        modalBody.append(typesElement);
    }

    function showLoading() {
        let loadingContainer = document.querySelector('#loading-screen');

        loadingContainer.classList.add('is-visible');
    }

    function hideLoading() {
        let loadingContainer = document.querySelector('#loading-screen');

        loadingContainer.classList.remove('is-visible');
    }

    return {
        showModal: showModal,
        showLoading: showLoading,
        hideLoading: hideLoading,
    };
})();

let pokemonRepository = (function (typeList = []) {
    let pokemonList = [];
    let currentFilteredList = [];
    let apiURL = 'https://pokeapi.co/api/v2/pokemon/?limit=100';

    function add(pokemon) {
        if (
            typeof pokemon === 'object' &&
            'name' in pokemon &&
            'detailsURL' in pokemon
        ) {
            pokemonList.push(pokemon);
        } else {
            console.log('pokemon formatting error: ' + pokemon);
        }
    }

    function getAll() {
        return currentFilteredList;
    }

    /* Goes into each pokemon and gets further details */
    async function loadDetails(item) {
        let url = item.detailsURL;
        try {
            const response = await fetch(url);
            const details = await response.json();
            //TODO:  Make alternative for sprite and official artwork
            item.imageURL = details.sprites.front_default;
            /* item.imageURL =
                details['sprites']['other']['official-artwork'][
                    'front_default'
                ]; */
            item.types = details.types;
            item.id = details.id;
        } catch (error) {
            console.log('Load Details did not work: ' + error);
        }
    }

    // Get all of our data into the pokemonList array
    async function loadList() {
        //Get stream from URL
        try {
            const response = await fetch(apiURL);
            const json = await response.json();
            //Create the pokemon object
            json.results.forEach(async function (item) {
                let pokemon = {
                    //Button display name; capitalized the way it should be.
                    name:
                        item.name.slice(0, 1).toUpperCase() +
                        item.name.slice(1),
                    //Where we find more data
                    detailsURL: item.url,
                };
                add(pokemon);
            });

            currentFilteredList = pokemonList.slice();

            let pokePromises = [];

            for (let i = 0; i < pokemonRepository.getAll().length; i++)
                pokePromises.push(loadDetails(pokemonRepository.getAll()[i]));

            await Promise.all(pokePromises);
        } catch (error) {
            console.log(error);
        }
    }

    //Add buttons along with all functionality
    function addListItem(pokemon) {
        // Get the container for all the buttons
        let selectablePokemonList = document.querySelector(
            '.selectable-pokemon-list'
        );

        // Create the button
        let button = document.createElement('div');
        button.classList.add('pokemon-button');
        //Button - Listener
        button.addEventListener('click', function () {
            modalManager.showModal(pokemon);
        });

        button.classList.add('btn');
        button.setAttribute('data-bs-target', '#pokeDetailsModal');
        button.setAttribute('data-bs-toggle', 'modal');

        //Accessibility
        button.ariaLabel = pokemon.name + ' button';

        //Button - Image
        let pokemonImage = new Image();
        pokemonImage.src = pokemon.imageURL;
        pokemonImage.classList.add('pokemon-image');

        //Accessibility
        pokemonImage.alt = 'Image of ' + pokemon.name;

        //Sets color to default if color is not available
        let pokemonType = pokemon.types[0].type.name.toLowerCase();
        pokemonImage.classList.add(pokemonType);

        let pokemonLabel = document.createElement('p');
        pokemonLabel.classList = 'pokemon-label';
        pokemonLabel.innerHTML = pokemon.name;

        button.appendChild(pokemonImage);
        button.appendChild(pokemonLabel);
        selectablePokemonList.appendChild(button);
    }

    /*     Filters by parsing string with priority:
    - type
    - keyword none
    - substring of pokemon name */

    function filterPokemon(filter) {
        /* Searchbar flag */

        if (filter == 'SEARCH_BY_INPUT')
            filter = document.querySelector('#search-input').value;

        console.log("filtering by: " + filter);

        if (filter == '') return false;

        //Filter by Type
        if (pokemonTypeList.includes(filter)) {
            
            currentFilteredList = [];
            pokemonList.forEach(function (pokemon) {
                if (pokemon.types.length == 1) {
                    if (pokemon.types[0].type.name.toLowerCase() == filter)
                        currentFilteredList.push(pokemon);
                } else {
                    if (
                        pokemon.types[0].type.name.toLowerCase() == filter ||
                        pokemon.types[1].type.name.toLowerCase() == filter
                    ) {
                        currentFilteredList.push(pokemon);
                    }
                }
            });
            createButtons();
            //No Filter (default)
        } else if (filter == 'none') {
            currentFilteredList = [];
            currentFilteredList = pokemonList.slice();
            createButtons();
        } else {
            currentFilteredList = [];
            pokemonList.forEach(function (pokemon) {
                if (pokemon.name.toLowerCase().includes(filter.toLowerCase()))
                    currentFilteredList.push(pokemon);
            });

            createButtons();
        }
    }

    return {
        getAll: getAll,
        loadList: loadList,
        addListItem: addListItem,
        filterPokemon: filterPokemon,
    };
})(pokemonTypeList);

/* The go button
    - Shows / Hides Loading Modal
    - Loads Data
    - Creates initial buttons with no filter */
// eslint-disable-next-line no-unused-vars
let initializeData = (async function () {
    modalManager.showLoading();
    await pokemonRepository.loadList();
    console.log("Data Loaded");
    modalManager.hideLoading();
    createButtons();
})();

//This will create all the buttons using functions in pokemonRepository.
function createButtons() {
    let selectablePokemonList = document.querySelector(
        '.selectable-pokemon-list'
    );

    selectablePokemonList.innerHTML = '';

    //All data is in our local array
    pokemonRepository.getAll().forEach(function (pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
}
