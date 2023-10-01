//Exercise 1.3

document.write ("<center><h1>Exercise 1.3</h1> <hr>");


// Our Pokedex
let pokemonList = [
    /* Base Object
    {
    name: '',
    type: []
    size:
    }
    */
    {
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
        type: ['Normal'],
        size: 1
    }
]

//Table Style
document.write('<style> table, th, td { border: 1px solid white; } </style>');

//Initialize table DO NOT REMOVE
document.write('<table>');

if(pokemonList.length>0){
    //Table Header
    document.write('<tr style="border: white 5px solid"><th>Pokemon Name</th><th>Type One</th><th>Type Two</th><th>Size</th></tr>');

    for(let i = 0; i<pokemonList.length; i++)
    {
        //DO NOT REMOVE
        document.write('<tr>')

        //Name
        document.write('<td>'+ pokemonList[i].name + '</td>')

        //Type One (expects there to be data)
        document.write('<td>' + pokemonList[i].type[0]+'</td>')

        //Prints second type or an empty cell if there isn't one
        if(pokemonList[i].type.length>1)
            document.write('<td>' + pokemonList[i].type[1]+'</td>')
        else
            document.write('<td></td>')
        
        //Size  (will be deleted at first opportunity)
        document.write('<td>');
        switch(pokemonList[i].size) {
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
    }
}

//End Table DO NOT REMOVE
document.write('</table>');

//Remove center from top
document.write('</center>')