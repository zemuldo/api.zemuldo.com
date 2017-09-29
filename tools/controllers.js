'use strict'
let {fetchMostPop,addReview,getFilterBlogs,getAllBlogs,getBlog,addNewBlog,getBlogs,addVisitor,getBlogsByTopics,updateBlogLikes,insertRichText,FetchRichText} = require('./database')
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
    getPostsTopic:(query) =>{
        return new Promise(function (resolve,reject) {
            let state  = getBlogsByTopics(query.queryParam)
            if(!state.error){
                resolve(state)
            }
            else {
                reject(state)
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

    },
    updateLikes:(query)=>{
        return new Promise(function (resolve,reject) {
            let state = updateBlogLikes(query.queryParam)
            if (!state.error) {
                resolve(state)
            }
            else {
                reject(state)
            }
        })
    },
    addRichText:(query)=>{
        return new Promise(function (resolve,reject) {
            let state = insertRichText(query.queryParam)
            if (!state.error) {
                resolve(state)
            }
            else {
                reject(state)
            }
        })
    },
    getRichText:(query)=>{
        return new Promise(function (resolve,reject) {
            let state = FetchRichText()
            if (!state.error) {
                resolve(state)
            }
            else {
                reject(state)
            }
        })
    },
    getMostLiked:(query)=>{
        return new Promise(function (resolve,reject) {
            let state = fetchMostPop(query.queryParam)
            if (!state.error) {
                resolve(state)
            }
            else {
                reject(state)
            }
        })
    }


}