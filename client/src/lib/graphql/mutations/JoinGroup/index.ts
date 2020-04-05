import { gql } from 'apollo-boost'

export const JOIN_GROUP = gql`
mutation joinGroup($id:String!,$languages:[String!]!){
    joinGroup(id:$id,languages:$languages){
      id
    }
}
`