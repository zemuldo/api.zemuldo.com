'use strict'
module.exports = {

    post:{
        title:{
            type: 'string',
            maxLen:40,
            minLen:6
        },
        body:{
            type:'string',
            maxLen:1500,
            minLen:400
        },
        type:{
            type:'string',
            dev:'Developer Articles. Related to Programming and Software Development',
            tech:'Technology based articles like BigData and AI',
            business:'Business articles',
            reviews:'Reviews',
            tuts:'Tutorials'
            },
        author:{
            type:'string'
        },
        topics:{
            type:'object'
        },
        images:{
            type:'object'
        }
    },
}