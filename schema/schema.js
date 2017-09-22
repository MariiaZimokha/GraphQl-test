const graphql = require('graphql');
const _ = require('lodash');
const axios = require('axios');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList
} = graphql;


const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                .then((res) => res.data);
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString},
        firstName: { type: GraphQLString},
        age: { type: GraphQLInt },
        company: { 
            type: CompanyType,
            resolve(parentValue, args) {
                // parentValue is an object. it contains all properties
                // and property type+Id 
                //in this case companyId

console.log('uytuytyuttuy');
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                .then( (res) => res.data);
            }
        } 
    })
});



const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString}},
            resolve(parentValue, args) {
                console.log('root: ')
                console.log('parentValue: ', parentValue)
                console.log('args: ', args)
                // return _.find(users, {id: args.id});
                return axios.get(`http://localhost:3000/users/${args.id}`)
                .then(res => res.data);
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString }},
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                .then((res) => res.data);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})