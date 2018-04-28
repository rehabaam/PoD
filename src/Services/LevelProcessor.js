const firstLevel = 0 ;

function incrementalLevel(level: Object) {
    console.log(level);
    if (level >= 0)
    {
        level = level + 1
     }
     else{

        level = firstLevel;
        
     }
    console.log(level);

    return level
}


function decrementalLevel(level: Object) {
    console.log(level);
    if (level < 0 )
    {
        level = firstLevel;
        
     }
     else{

        level = level - 1

     }
    console.log(level);

    return level
}


export default {
    incrementalLevel,
    decrementalLevel
}
