import { gql } from 'apollo-boost'

export const USER = gql`
query User($id:ID!,$helpRequestsPage:Int!,$limit:Int!){
   user(id:$id){
     id
    name
    avatar
    contact
    address
    salt
    verifiedAccount
    memberAtt {
      avatar
      id
    }
    adminAtt {
      name
      id
    }
    geoLocation {
      lat 
      lng
    }
    helpRequests(limit:$limit,page:$helpRequestsPage) {
      total
      result { 
        title
        description
      }
    }
  }
}
`