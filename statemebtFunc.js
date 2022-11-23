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
    const queryAllProperty = gql`
    {  
      allProperties(
        where: { 
          organization: { 
            id: "51b171d3-b54d-48f8-a36a-f8308f518637" 
          } 
        }
      ) {
        id
        address
        name
        type
        __typename
        organization {
          __typename
          id
        }
      }
    }
    `

    const data = await graphQLClient.request(queryAuth, variables);
    // console.log (data)
    graphQLClient.setHeaders({
        "Authorization": `Bearer ${data.obj.token}`
    })

    const allProperty = await graphQLClient.request(queryAllProperty, variables);


}

module.exports = main;