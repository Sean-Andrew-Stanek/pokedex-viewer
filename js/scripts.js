alert('Hello World');

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

