const { request, gql, GraphQLClient } = require('graphql-request');
require('dotenv').config();
const crypto = require('crypto');

async function main(ticket) {
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
    const queryCreateTicket = gql`
      mutation createTicket(
        $fingerprint: String!
        $organizationId: ID!
        $sourceId: ID!
        $propertyId: ID!
        $details: String
        $unitName: String
        $unitType: String
      ) {
        createTicket(
          data: {
            dv: 1
            sender: { dv: 1, fingerprint: $fingerprint }
            organization: { connect: { id: $organizationId } }
            property: { connect: { id: $propertyId } }
            source: { connect: { id: $sourceId } }
            details: $details
            unitName: $unitName
            unitType: $unitType
          }
        ) {
          id
          details
          number
          status {
            name type __typename
          }
        }
      }
    `
    // get auth token and set token to request headers
    const data = await graphQLClient.request(queryAuth, variables);
    graphQLClient.setHeaders({
        "Authorization": `Bearer ${data.obj.token}`
    })
    // get property id
    const allProperty = await graphQLClient.request(queryAllProperty, variables);
    const build = await allProperty.allProperties.find((item) => item.address.match(ticket.street) && item.address.endsWith(ticket.build));

    const createTicketVariables = {
        fingerprint: crypto.randomUUID(),
        organizationId: process.env.ID_ORG,
        sourceId: "779d7bb6-b194-4d2c-a967-1f7321b2787f",
        propertyId: build.id,
        unitName: ticket.unit,
        unitType: "flat",
        details: ticket.text
    }

    return await graphQLClient.request(queryCreateTicket, createTicketVariables).then((data) => data)
}

module.exports = main;