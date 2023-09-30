//Exercise 1.1

alert('Hello world');
document.write("Exercise 1.1 <hr>")
let favoriteFood = ['pickles', 'potatoes', 'carrots'];
document.write('My favorite food');

if(favoriteFood.length>0){
    if(favoriteFood.length>1){
    document.write('s are ');
    for (var i = 0; i<favoriteFood.length-1; i++)
        document.write(favoriteFood[i] + ', ');
    document.write('and ');
    }
    else{
        document.write(' is ');
    }

    document.write(favoriteFood[favoriteFood.length-1] + ".");
}else{
    document.write('I don\'t like food.  It\'s yucky!');
}

//Exercise 1.2

document.write ("<hr>Exercise 1.2 <hr>")

let pokemonList = [
    /* Base Object
    {
    name: '',
    type: []
    }
    */
    {
        name: 'Bulbasaur',
        type: ['Grass', 'Poison']
    },
    {
        name: 'Ivysaur',
        type: ['Grass', 'Poison']
    },
    {
        name: 'Venusaur',
        type: ['Grass', 'Poison']
    },
    {
        name: 'Eevee',
        type: ['Normal']
    }
]

document.write('<style> table, th, td { border: 1px solid white; } </style>');
document.write('<table>');

if(pokemonList.length>0){
    document.write('<tr style="border: white 5px solid"><th>Pokemon Name</th><th>Type One</th><th>Type Two</th></tr>');

    for(let i = 0; i<pokemonList.length; i++)
    {
        document.write('<tr>')
        document.write('<td>'+ pokemonList[i].name + '</td>')
        //Assumes there is at least one type defined
        document.write('<td>' + pokemonList[i].type[0]+'</td>')
        if(pokemonList[i].type.length>1)
            document.write('<td>' + pokemonList[i].type[1]+'</td>')
        document.write('</tr>');
    }
}

document.write('</table>');