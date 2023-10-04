
let pokemonRepository = (function() {
    
    let pokemonList = [];
    let apiURL = 'https://pokeapi.co/api/v2/pokemon/?limit=50';

    //style.css button types  TODO:  Add all types
    let implementedTypes = ['normal', 'fire', 'water', 'grass'];

    //This will later interact with the main screen
    function showDetails(pokemon) {
        console.log(pokemon.id);
    }
    
    function add(pokemon){
        if (
            typeof pokemon === 'object' &&
            'name' in pokemon &&
            'detailsURL' in pokemon &&
            'imageURL' in pokemon &&
            'height' in pokemon &&
            'types' in pokemon &&
            'id' in pokemon
        ){
            pokemonList.push(pokemon);
        } else {
            console.log('pokemon formatting error');
        }
    }

    function getAll(){
        return pokemonList;
    }

    async function loadDetails(item) {
        let url = item.detailsURL;
        try {
            const response = await fetch(url);
            const details = await response.json();
            //TODO:  Don't modify the parameter, but return an array and modify where called
            let returnObject = {};
            item.imageURL = details.sprites.front_default;
            item.height = details.height;
            item.types = details.types;
            item.id = details.id;
        } catch (error) {
            console.error(error);
        }
    }

    async function loadList() {
        //Get stream from URL
        try {
            const response = await fetch(apiURL);
            const json = await response.json();
            //Create the pokemon object
            json.results.forEach(async function (item) {
                let pokemon = {
                    //Button display name; capitalized the way it should be.
                    name: (item.name.slice(0, 1)).toUpperCase() + item.name.slice(1),
                    //Where we find more data
                    detailsURL: item.url
                };
                await loadDetails(pokemon);                
                add(pokemon);
            });
        } catch (error) {
            console.error(error);
        }
    }

    function addListItem(pokemon) {
        // Left side "button container"
        let selectablePokemonList = document.querySelector('.selectable-pokemon-list');

        // Create a list item    
        let listItem = document.createElement('div');

        let button = document.createElement('button');
        button.innerText = pokemon.name;
        
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
    }


    return {
        getAll: getAll,
        loadList: loadList,
        addListItem: addListItem,
        showDetails: showDetails,
    };
})();

async function createButtons(){
    //Create buttons for the repository
    await pokemonRepository.loadList();
    
    /*****   Look here  *****/
    console.log(pokemonRepository.getAll());
    pokemonRepository.getAll().forEach(function(pokemon)
    {
        console.log("THIS DOESN'T FIRE");
        pokemonRepository.addListItem(pokemon);
    });
}

createButtons();
