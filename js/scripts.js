


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
            'detailsURL' in pokemon
        ){
            pokemonList.push(pokemon);
        } else {
            console.log('pokemon formatting error: ' + pokemon);
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
            console.console("Load Details didn't work: " + error);
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
                add(pokemon);
            });
            
            let pokePromises = [];
            
            for(let i = 0; i<pokemonRepository.getAll().length; i++)
                pokePromises.push(loadDetails(pokemonRepository.getAll()[i]));
            
            await Promise.all(pokePromises);
            console.log(pokemonList);



        } catch (error) {
            console.log(error);
        }
    }

    function addListItem(pokemon) {
        // Get the container for all the buttons
        let selectablePokemonList = document.querySelector('.selectable-pokemon-list');

        // Create the button    
        let button = document.createElement('div');

        button.classList.add('pokemon-button');
        button.addEventListener('click', function() {
            pokemonRepository.showDetails(pokemon);
        });

        //Create Button
        let pokemonImage = new Image();
        pokemonImage.src = pokemon.imageURL;
        pokemonImage.classList.add('pokemon-image')
       
        
        //If the type colors for buttons have been added in style.css, give the type as a class
        //otherwise, give it default colors
        let pokemonType = pokemon.types[0].type.name.toLowerCase();
        if(implementedTypes.includes(pokemonType))
            pokemonImage.classList.add(pokemonType);
        else
            pokemonImage.classList.add('default-type')

        let pokemonLabel = document.createElement('p');
        pokemonLabel.classList = 'pokemon-label';
        pokemonLabel.innerHTML = pokemon.name;

        button.appendChild(pokemonImage);
        button.appendChild(pokemonLabel)
        selectablePokemonList.appendChild(button);
    }


    return {
        getAll: getAll,
        loadList: loadList,
        addListItem: addListItem,
        showDetails: showDetails,
    };
})();

//This will create all the buttons using functions in pokemonRepository.
let createButtons = (async function(){

    //Create buttons for the repository
    await pokemonRepository.loadList();

    //All data is in our local array
    pokemonRepository.getAll().forEach(function(pokemon)
    {
        pokemonRepository.addListItem(pokemon);
    });   
    
})();

//This will create the modal that will pop up when a button is selected.
let modalManager = (function(){
    
    let modalContainer = document.querySelector('#modal-container');

    function showModal(title, text) {
        
        modalContainer.innerHTML = '';

        let modal = document.createElement('div');
        modal.classList.add('modal');

        //Add new modal content
        let closeButtonElement = document.createElement('button');
        closeButtonElement.classList.add('modal-close');
        closeButtonElement.innerText = 'Close';
        closeButtonElement.addEventListener('click', hideModal);
        let titleElement = document.createElement('h1');
        titleElement.innerText = title;

        let contentElement = document.createElement('p');
        contentElement.innerText = text;

        modal.appendChild(closeButtonElement);
        modal.appendChild(titleElement);
        modal.appendChild(contentElement);
        modalContainer.appendChild(modal);

        modalContainer.classList.add('is-visible');
    }

    document.querySelector('#show-modal').addEventListener('click', () => {
        showModal('Modal title', 'This is a modal!');
    });

    function hideModal() {
        console.log("ding!");
        modalContainer.classList.remove('is-visible');
    }

    window.addEventListener('keydown', (e) => {
        if(e.key === 'Escape' && modalContainer.classList.contains('is-visible')){
            hideModal();
        }
    });

    modalContainer.addEventListener('click', (e) =>{
        let target = e.target;
        if(target === modalContainer) {
            hideModal();
        }

    });

    return {
        showModal: showModal
    };
})();