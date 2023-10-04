
let pokemonRepository = (function() {
    
    let pokemonList = [];
    let apiURL = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    //style.css button types  TODO:  Add all types
    let implementedTypes = ['normal', 'fire', 'water', 'grass'];

    //This will later interact with the main screen
    function showDetails(pokemon) {
        console.log(pokemon.id);
    }
    
    function add(pokemon){
        if (
            typeof pokemon === 'object' &&
            'name' in pokemon
        ) {
            pokemonList.push(pokemon);
        } else {
            console.log('pokemon formatting error');
        }
    }

    function getAll(){
        return pokemonList;
    }

    function loadDetails(item) {
        let url = item.detailsURL;
        
        return fetch(url)
        .then(function (response){
            //return JSON to next function
            return response.json();
        }).then(function (details) {
            //TODO:  Don't modify the parameter, but return an array and modify where called
            item.imageURL = details.sprites.front_default;
            item.height = details.height;
            item.types = details.types;
            item.id = details.id;
        }).catch(function (error) {
            console.error(error);
        })
    }
dfdfgdsfg
    function loadList() {
        return fetch(apiURL)
        .then(function (response) {
            //send the json to next function
            return response.json();
        }).then(function (json) {
            json.results.forEach(function(item) {
                let pokemon = {
                    //Button display name; capitalized the way it should be.
                    name: (item.name.slice(0,1)).toUpperCase()+item.name.slice(1),
                    //Where we find more data
                    detailsURL: item.url
                };
                add(pokemon);
            });            
        }).catch(function(error)
        {
            console.error(error);
        })
    }

    function addListItem(pokemon) {
        // Create a list item    
        let listItem = document.createElement('div');

        let button = document.createElement('button');
        button.innerText = pokemon.name;
        
        /* console.log(pokemon); */

        //I need both the ID and the color for the buttons / order, so we are loading the data now.
        //This causes delay, but later, we can hide the delay through visual trickery.
        loadDetails(pokemon)
        .then(function()
        {    
            /* console.log(pokemon); */
            //If the type colors for buttons have been added in style.css, give the type as a class
            //otherwise, give it default colors
            let pokemonType = pokemon.types[0].type.name.toLowerCase();
            if(implementedTypes.includes(pokemonType))
                button.classList.add(pokemonType);
            else
                button.classList.add('default-type')

            button.classList.add('pokemon-button');
            button.addEventListener('click', function() {
                pokemonRepository.showDetails(pokemon);
            });
            listItem.appendChild(button);
            selectablePokemonList.appendChild(listItem);
        }).catch(function(error)
        {
            console.error(error)
        }).finally(function(){
            console.log(pokemon);
        })
    }


    return {
        add: add,
        getAll: getAll,
        loadList: loadList,
        addListItem: addListItem,
        showDetails: showDetails,
    };
})();

// Left side "button container"
let selectablePokemonList = document.querySelector('.selectable-pokemon-list');

//Create buttons for the repository
pokemonRepository.loadList()
.then(function(){
    pokemonRepository.getAll().forEach(function(pokemon)
    {
        pokemonRepository.addListItem(pokemon);
    });
}).catch(function(error)
{
    console.error(error);
}).finally(function(){
    console.log(pokemonRepository.getAll()[0]);
});

