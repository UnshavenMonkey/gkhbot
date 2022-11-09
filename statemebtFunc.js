const { request, gql, GraphQLClient } = require('graphql-request');
require('dotenv').config();

async function main() {
    const endpoint = 'https://v1.doma.ai/admin/api';
    const variables = {
        phone: process.env.PHONE,
        password: process.env.PASSWORD,
    }

    const graphQLClient = new GraphQLClient(endpoint);

    const queryAuth = gql`
      mutation authenticateUserWithPhoneAndPassword ($phone: String!, $password: String!) {
        obj: authenticateUserWithPhoneAndPassword(data: {phone: $phone, password: $password}) {
         token item { id name } } }
    `
    const data = await graphQLClient.request(queryAuth, variables);
    console.log(data);
    return data;

}

module.exports = main;