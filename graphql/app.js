const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const port = 8600;
const app = express();
var schema = require('./model/schema');

app.use('/graphql',
    graphqlHTTP({
        schema:schema,
        graphiql:true
    }
))

app.listen(port)