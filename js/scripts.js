//Exercise 1.5

document.write ("<center><h1>Exercise 1.3</h1> <hr>");


/*** EXERCISE 1.5 IIFE ***/
let pokemonRepository = function() {

    //*** EXERCISE 1.5 DATASET ***/
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
        /*** EXERCISE 1.5 PUBLIC FUNCTIONS ***/
        add: function(pokemon) {
            pokemonList.push(pokemon);
        },
        getAll: function() {
            return pokemonList;
        }
    };
}();

//BONUS: shows that you can add to the list
let addPokemon = {name: 'Charmander', type: ['Fire',''], size: 1};
pokemonRepository.add(addPokemon);
//Table Style
document.write('<style> table, th, td { border: 1px solid white; } </style>');

//Initialize table DO NOT REMOVE
document.write('<table>');

/*** EXERCISE 1.5 FOREACH LOOP ***/
pokemonRepository.getAll().forEach(function(pokemon)
{
    //DO NOT REMOVE
    document.write('<tr>')

    //Name
    document.write('<td>'+ pokemon.name + '</td>')

    //Type One (expects there to be data)
    document.write('<td>' + pokemon.type[0]+'</td>')

    //Prints second type or an empty cell if there isn't one
    if(pokemon.type.length>1)
        document.write('<td>' + pokemon.type[1]+'</td>')
    else
        document.write('<td></td>')
    
    //Size  (will be deleted at first opportunity)
    document.write('<td>');
    switch(pokemon.size) {
        case 1:
            document.write('Small (unevolved)');
            break;
        case 2:
            document.write('Medium (first evolution)');
            break;
        default:
            document.write('Large (Wow, that\'s Big!)')
    };
    document.write('</td>');

    //Ends row DO NOT REMOVE
    document.write('</tr>');

});


//End Table DO NOT REMOVE
document.write('</table>');

//Remove center from top
document.write('</center>')