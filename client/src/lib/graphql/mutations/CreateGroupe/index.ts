import { gql } from 'apollo-boost'

export const CREATE_GROUPE = gql`
mutation createGroup($name:String!,$description:String!,$avatar:String!){
 createGroup(name:$name,description:$description,avatar:$avatar){
   id
 }
}
`