'use strict'
let {addReview,getFilterBlogs,getAllBlogs,getBlog,addNewBlog,getBlogs,addVisitor} = require('./database')
let {validatePost} = require('../tools/utilities')


module.exports = {
    newPost:data =>{
        return new Promise(async function (resolve,reject) {
            let validate = await validatePost(data)
            if(!validate.error){
                let state  = addNewBlog(data)
                resolve(state)
            }
            else{
                reject(validate)
            }
        })
            .then(function (succeed) {
                return succeed
            })
            .catch(function (err) {
                return err
            })
    },
    getPost:data =>{
        return new Promise(function (resolve,reject) {
            if(data){
                let state  = getBlog(data.queryParam)
                resolve(state)
            }
            else {
                reject(false)
            }
        })
            .then(function (succeed) {
                return succeed
            })
            .catch(function (err) {
                return err
            })
    },
    getPosts:data =>{
        return new Promise(function (resolve,reject) {
            if(data){
                let state  = getBlogs(data.queryParam)
                resolve(state)
            }
            else {
                reject(false)
            }
        })
            .then(function (succeed) {
                return succeed
            })
            .catch(function (err) {
                return err
            })
    },
    addUser:data =>{
        return new Promise(function (resolve,reject) {
            if(data){
                resolve(true)
            }
            else {
                reject(false)
            }
        })
            .then(function (succeed) {
                return succeed
            })
            .catch(function (err) {
                return err
            })
    }

}