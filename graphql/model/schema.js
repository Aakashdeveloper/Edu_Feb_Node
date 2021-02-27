const graphql = require('graphql');
const axios = require('axios');

const {
    GraphQLFloat,
    GraphQLInt,
    GraphQLString,
    GraphQLSchema,
    GraphQLObjectType
}= graphql

const MovieType = new GraphQLObjectType({
    name:'Movies',
    fields:{
        id: {type:GraphQLInt},
        name: {type:GraphQLString},
        city:{type:GraphQLString},
        locality: {type:GraphQLString},
        thumb: {type:GraphQLString},
        aggregate_rating: {type:GraphQLFloat},
        rating_text: {type:GraphQLString},
        min_price:{type:GraphQLInt},
    }
})

//get
const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        Movies:{
            type:MovieType,
            args:{id:{type:GraphQLInt}},
            resolve(parentValue,args){
                return axios.get(`http://localhost:8900/products/${args.id}`)
                .then((res) => res.data)
            }
        }
    }
})

//post
const mutation = new GraphQLObjectType({
    name:"Mutation",
    fields:{
        addMovies:{
            args:{
                id: {type:GraphQLInt},
                name: {type:GraphQLString},
                city:{type:GraphQLString},
                locality: {type:GraphQLString},
                thumb: {type:GraphQLString},
                aggregate_rating: {type:GraphQLFloat},
                rating_text: {type:GraphQLString},
                min_price:{type:GraphQLInt},
            },
            resolve(parentValue,{id,name,aggregate_rating}){
                return axios.post(`http://localhost:8900/products`,{id,name,aggregate_rating})
                .then((res) => res.data)
            }
        }
    }
})

module.exports= new GraphQLSchema({
    query:RootQuery,
    mutation:mutation
})

/*
{
  Movies(id:4){
   thumb
  }
}
mutation {
  addMovies(id: 8889, name: "GoGo", aggregate_rating: 3.5) {
    id
  }
}

*/
