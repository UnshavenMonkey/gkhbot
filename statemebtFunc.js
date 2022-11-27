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
      ) {
        createTicket(
          data: {
            dv: 1
            sender: { dv: 1, fingerprint: $fingerprint }
            organization: { connect: { id: $organizationId } }
            property: { connect: { id: $propertyId } }
            source: { connect: { id: $sourceId } }
            details: $details
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

    const queryAllTicket = gql`
      {
        allTickets {
          id
          organization {
            id
            name
          }
          details
        }
      }
    `

    const data = await graphQLClient.request(queryAuth, variables);
    graphQLClient.setHeaders({
        "Authorization": `Bearer ${data.obj.token}`
    })

    const allProperty = await graphQLClient.request(queryAllProperty, variables);
    const street = await allProperty.allProperties.find((item) => item.address.match(ticket.street) && item.address.endsWith(ticket.build));

    const createTicketVariables = {
        fingerprint: crypto.randomUUID(),
        organizationId: process.env.ID_ORG,
        sourceId: "779d7bb6-b194-4d2c-a967-1f7321b2787f",
        propertyId: street.id,
        details: ticket.text
    }

    // await graphQLClient.request(queryCreateTicket, createTicketVariables).then((data) => data);
    return await graphQLClient.request(queryCreateTicket, createTicketVariables).then((data) => data)
}

module.exports = main;