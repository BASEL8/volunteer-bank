import { gql } from 'apollo-boost'

export const VERIFY_REQUEST = gql`
mutation verifyRequest($id:String!,$groupId:String!){
  verifyRequest(id:$id,groupId:$groupId){
    id
  }
}
`