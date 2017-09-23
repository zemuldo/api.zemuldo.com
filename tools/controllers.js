'use strict'
let {addReview,getFilterBlogs,getAllBlogs,getBlog,addNewBlog,getBlogs,addVisitor} = require('./database')


module.exports = {
    newPost:data =>{
        return new Promise(function (resolve,reject) {
            if(data){
                let state  = addNewBlog(data)
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