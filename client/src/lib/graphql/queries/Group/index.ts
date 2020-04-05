import { gql } from 'apollo-boost'

export const GROUP = gql`
query group($id:ID!){
   group(id:$id){
     id
     name
     description
     by
     address
     avatar
     creatorId
     groupMembers {
       id
       avatar
       name
     } 
     joinRequests {
       id
       avatar
       contact
       name
     }
  }
}
`