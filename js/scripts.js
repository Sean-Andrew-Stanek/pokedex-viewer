let pokemonTypeList = ['water', 'normal', 'fire','grass','default','electric',
    'ice','fighting','poison','ground','flying','psychic','bug','rock','ghost',
    'dragon','dark','steel','fairy'];


let createDropdownOptions = (function(){

    let typeFilterRoot = document.querySelector("#filter-by-type");

    //Adds options to the dropdown for filtering by type
    for(let i = 0; i<pokemonTypeList.length; i++){
        let anchor = document.createElement('a');
        anchor.setAttribute('href', '#');
        anchor.setAttribute('onclick', "pokemonRepository.filterPokemon('" + pokemonTypeList[i].slice(0,1) + pokemonTypeList[i].slice(1) + "')");
        
        anchor.classList.add('dropdown-item');
        anchor.innerHTML = pokemonTypeList[i];

        let listItem = document.createElement('li');
        listItem.append(anchor);

        typeFilterRoot.append(listItem);
    }

})();

let modalManager = (function(){
    
    let modalContainer = document.querySelector('#modal-container');

    function showModal(pokemon) {
        
        modalContainer.innerHTML = '';

        let modal = document.createElement('div');
        modal.classList.add('modal');

    //Pokemon Image
        let imageWrapper = document.createElement('div');
        let modalImage = new Image();
        modalImage.src = pokemon.imageURL;

        //Set background color based on type
        let pokemonType = pokemon.types[0].type.name.toLowerCase();
        modal.classList.add(pokemonType);

        imageWrapper.classList.add('modal-image');
        imageWrapper.appendChild(modalImage);

    //Pokemon Details
        let pokeProperties = ['name', 'id', 'types']
        let pokePropertiesUI = ['Pokemon Name:', 'National ID:', 'Types:'];

        let labelBackground = '../images/modal_label.png';

        for(let i = 0; i < pokeProperties.length; i++)
        {
        // LABEL
            let nextLabel = document.createElement('div');
            let nextLabelImage = new Image();
            nextLabelImage.src = labelBackground;
            let nextLabelText = document.createElement('p');
            nextLabelText.innerHTML = pokePropertiesUI[i];
            //Sets the text


            //All Style for the details flow from here to children
            nextLabel.classList.add('modal-label');

            nextLabelText.classList.add('modal-label-text');

            //Put label together
            nextLabel.appendChild(nextLabelImage);
            nextLabel.appendChild(nextLabelText);

        //DETAILS
            let nextDetails = document.createElement('div');

            //Types need to be formatted differently
            if(pokeProperties[i]!='types')
                nextDetails.innerHTML = pokemon[pokeProperties[i]];
            else{
                nextDetails.innerHTML = pokemon[pokeProperties[i]][0].type.name;
                if(pokemon[pokeProperties[i]].length>1)
                    nextDetails.innerHTML += ' / ' + pokemon[pokeProperties[i]][1].type.name;

            }            
            //Style
            nextDetails.classList.add('modal-data');
            
        // ADD IMAGE, LABEL AND DETAILS
            modal.appendChild(nextLabel);
            modal.appendChild(nextDetails);
            
        }

        modal.appendChild(imageWrapper);


        //Add Close Button
        let closeButtonElement = document.createElement('button');
        closeButtonElement.classList.add('modal-close');
        closeButtonElement.classList.add('btn');
        closeButtonElement.classList.add('btn-primary');
        closeButtonElement.ariaLabel = "Close the Modal"
        closeButtonElement.innerText = 'Close';
        closeButtonElement.addEventListener('click', hideModal);
        

        modal.appendChild(closeButtonElement);
        modalContainer.appendChild(modal);

        modalContainer.classList.add('is-visible');
    }

    function hideModal() {
        modalContainer.classList.remove('is-visible');
    }

    function showLoading(){
        let loadingContainer = document.querySelector('#loading-modal');

        loadingContainer.classList.add("is-visible");
    }

    function hideLoading(){
        let loadingContainer = document.querySelector('#loading-modal');

        loadingContainer.classList.remove("is-visible");
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
        showModal: showModal,
        showLoading: showLoading,
        hideLoading: hideLoading
    };
})();


let pokemonRepository = (function() {
    
    let pokemonList = [];
    let currentFilteredList = [];
    let apiURL = 'https://pokeapi.co/api/v2/pokemon/?limit=1000';

    //This will later interact with the main screen
    function showDetails(pokemon) {
        console.log(pokemon);
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
        return currentFilteredList;
    }

    async function loadDetails(item) {
        let url = item.detailsURL;
        try {
            const response = await fetch(url);
            const details = await response.json();
            //TODO:  Don't modify the parameter, but return an array and modify where called
            /* item.imageURL = details.sprites.front_default; */
            item.imageURL = details["sprites"]["other"]["official-artwork"]["front_default"];
            item.height = details.height;
            item.types = details.types;
            item.id = details.id;


 /*            //Some pokemon are improper

            {
                pokemonList.splice(pokemonList.indexOf(item),1);

            } */
        } catch (error) {
            console.log("Load Details didn't work: " + error);
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
                    name: (item.name.slice(0, 1)).toUpperCase() + item.name.slice(1),
                    //Where we find more data
                    detailsURL: item.url
                };
                add(pokemon);
            });
            
            currentFilteredList = pokemonList.slice();

            let pokePromises = [];
            
            for(let i = 0; i<pokemonRepository.getAll().length; i++)
                pokePromises.push(loadDetails(pokemonRepository.getAll()[i]));
            
            await Promise.all(pokePromises);

        } catch (error) {
            console.log(error);
        }
    }

    //Add buttons along with all functionality
    function addListItem(pokemon) {
        // Get the container for all the buttons
        let selectablePokemonList = document.querySelector('.selectable-pokemon-list');        

        // Create the button    
        let button = document.createElement('button');
        button.classList.add('pokemon-button');
        //listener
        button.addEventListener('click', function(){ 
            modalManager.showModal(pokemon);
        });
        //Create Button
        let pokemonImage = new Image();
        pokemonImage.src = pokemon.imageURL;
        pokemonImage.classList.add('pokemon-image')
       
        
        //Sets color to default if color isn't available
        let pokemonType = pokemon.types[0].type.name.toLowerCase();
        pokemonImage.classList.add(pokemonType);

        let pokemonLabel = document.createElement('p');
        pokemonLabel.classList = 'pokemon-label';
        pokemonLabel.innerHTML = pokemon.name;

        button.appendChild(pokemonImage);
        button.appendChild(pokemonLabel)
        selectablePokemonList.appendChild(button);
    }

    function filterPokemon(filter)
    {
        if(filter=='SEARCH_BY_INPUT')
            filter=document.querySelector('#search-input').value;

        if(filter=='')
            return;

        //Filter by Type
        if(pokemonTypeList.includes(filter)){
            currentFilteredList = [];
            pokemonList.forEach(function(pokemon){
                if(pokemon.types.length==1)
                {
                    if(pokemon.types[0].type.name.toLowerCase()==filter)
                        currentFilteredList.push(pokemon);
                }else
                {                    
                    if(pokemon.types[0].type.name.toLowerCase()==filter ||
                    pokemon.types[1].type.name.toLowerCase()==filter){
                        currentFilteredList.push(pokemon);
                    }
                }
            });
            createButtons();
            return;
        //No Filter (default)
        }else if (filter == 'none')
        {
            currentFilteredList = [];
            currentFilteredList = pokemonList.slice();
            createButtons();
            return;
        }else {
            currentFilteredList = [];
            pokemonList.forEach(function(pokemon){
                if(pokemon.name.toLowerCase().includes(filter.toLowerCase()))
                    currentFilteredList.push(pokemon)
            });
            createButtons();
            return;
        }

        console.log("Improper filter: " + filter);
    }

    return {
        getAll: getAll,
        loadList: loadList,
        addListItem: addListItem,
        showDetails: showDetails,
        filterPokemon: filterPokemon
    };
})();

let initializeData = (async function(){

    modalManager.showLoading();
    //Create buttons for the repository
    await pokemonRepository.loadList();
    modalManager.hideLoading();
    createButtons();

})();


//This will create all the buttons using functions in pokemonRepository.
function createButtons() {
    let selectablePokemonList = document.querySelector('.selectable-pokemon-list');    

    selectablePokemonList.innerHTML = '';

    //All data is in our local array
    pokemonRepository.getAll().forEach(function(pokemon)
    {
        pokemonRepository.addListItem(pokemon);
    });   
    
};

