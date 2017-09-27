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
    getFiltered:data =>{
        return new Promise(function (resolve,reject) {
            if(data){
                let state  = getFilterBlogs(data.queryParam)
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
    getAllPosts:() =>{
        return new Promise(function (resolve,reject) {
            let state  = getAllBlogs()
            if(!state.error){
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
    addNewVisitor:(data) =>{
        console.log(data)
        return new Promise(function (resolve,reject) {
            let state  = addVisitor(data)
            if(!state.error){
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
    getClientIp:(ip)=>{
        return ip
    },

    addNewReview:(data)=>{
        return new Promise(function (resolve,reject) {
            let state = addReview(data)
            if(!state.error){
                resolve(state)
            }
            else {
                reject({error:"error occured"})
            }
        })

    }


}