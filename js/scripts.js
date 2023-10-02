
let pokemonRepository = function() {
    let pokemonList = [{
        name: 'Bulbasaur',
        type: ['Grass', 'Poison'],
        size: 1
    },
    {
        name: 'Ivysaur',
        type: ['Grass', 'Poison'],
        size: 2
    },
    {
        name: 'Venusaur',
        type: ['Grass', 'Poison'],
        size: 3
    },
    {
        name: 'Eevee',
        type: ['Normal',''],
        size: 1
    }];

    return{
        add: function(pokemon) {
            pokemonList.push(pokemon);
        },
        getAll: function() {
            return pokemonList;
        },
        addListItem: function(pokemon) {
            // Create a list item    
            let listItem = document.createElement('div');

            let button = document.createElement('button');
            button.innerText = pokemon.name;
            
            //TODO:  Add style for all types
            button.classList.add(pokemon.type[0].toLowerCase());
            button.classList.add('pokemon-button');
            button.addEventListener('click', function() {pokemonRepository.showDetails(pokemon)});

            listItem.appendChild(button);
            selectablePokemonList.appendChild(listItem);
        },
        showDetails: function(pokemon) {
            console.log(pokemon);
        }

    };
}();


//Example of adding a new object
pokemonRepository.add({name: 'Charmander', type: ['Fire',''], size: 1});

// Left side "button container"
let selectablePokemonList = document.querySelector('.selectable-pokemon-list');

//Create buttons for the repository
pokemonRepository.getAll().forEach(function(pokemon)
{
    pokemonRepository.addListItem(pokemon);

});

// Shorthand, but compatability issues
// pokemonRepository.getAll().forEach(pokemon => pokemonRepository.addListItem(pokemon))