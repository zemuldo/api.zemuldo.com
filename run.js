let x = function(test){
    return new Promise(function(pass,fail){
        setTimeout(function(){
            if(test===true){
                pass(test)
            }
            else(
                fail({error:false})
            )
        },3000)
    })
    .then(function(o){
        return o
    })
    .catch(function(e){
        return e
    })
}
let y = function(test){
    return new Promise(function(pass,fail){
        // setTimeout(function(){
        //     if(test===true){
        //         pass(test)
        //     }
        //     else(
        //         fail({error:false})
        //     )
        // },3000)
        pass(x(false))
        
    })
    .then(function(o){
        return o
    })
    .catch(function(e){
        return e
    })
}

x(true)
.then(function(o){
    return y(o)
})
.then(function(o){
    console.log(o)
})
.catch(function(e){
    console.log(e)
})

console.log('END')