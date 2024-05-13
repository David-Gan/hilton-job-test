import { gql } from "@apollo/client";

export const GET_RESERVATIONS = gql`
query Query($date: String, $status: String) {
  reservations(date: $date, status: $status) {
    id
    name
    contact
    arrivalAt
    size
    status
  }
}
`;

export const GET_MY_RESERVATIONS = gql`
query Query {
    myReservations {
        id
        name
        contact
        arrivalAt
        size
        status
    }
}
`;

export const CREATE_RESERVATION = gql`
mutation Mutation($input: CreateReservationInput!) {
    createReservation(input: $input) {
      id
      name
      contact
      arrivalAt
      size
      status
    }
  }
`

export const UPDATE_RESERVATION = gql`
mutation Mutation($input: UpdateReservationInput!) {
    updateReservation(input: $input) {
      id
    }
  }
`

export const CANCEL_RESERVATION = gql`
mutation Mutation($cancelReservationId: String!) {
    cancelReservation(id: $cancelReservationId) {
      id
    }
  }
`

export const COMPLETE_RESERVATION = gql`
mutation Mutation($completeReservationId: String!) {
    completeReservation(id: $completeReservationId) {
      id
    }
  }
`