'use strict'
let schemas = require('../schemas/index')

module.exports ={
    validatePost: (post)=> {
        let validator = schemas.post
        return new Promise(function (resolve,reject) {
            if(post){
                let state = {error:'invalid data'}
                Object.keys(post).forEach(function(prop) {
                    if(validator[prop]){
                        if(validator[prop].type!==typeof post[prop]){
                            reject( {error:'Expecting '+validator[prop].type+" on field "+prop+' but got '+ typeof post[prop]})
                        }
                        else {
                            state = true
                        }
                    }
                    else {
                        return {error: "No "+post[prop]+" defined in post"}
                    }
                })
                resolve(state)
            }
            else {
                reject({error:'invalid data '})
            }
        })
            .then(function (success) {
                if(success){
                    if(!(post.title.length>validator.title.minLen && post.title.length<validator.title.maxLen)){
                        return {error:"title must be between "+validator.title.minLen+" and "+validator.title.maxLen +' characters'}
                    }
                    if(!(validator.type[post.type])){
                        return {error:"No category "+post.type}
                    }
                    let bodyWords = post.body.split(' ').length
                    if(!(bodyWords>validator.body.minLen && bodyWords<validator.body.maxLen)){
                        return {error:"Body must be between "+validator.body.minLen+" and "+validator.body.maxLen +' words'}
                    }
                    if(post.author!=="Danstan Onyango"){
                        return {error:"User  "+post.author+" doesn't exist"}
                    }
                    return true
                }
            })
            .catch(function (err) {
                return err
            })

    }

}