import { gql } from 'apollo-boost'
export const LOGIN_EMAIL = gql`
mutation LoginEmail($input:LoginEmailInputs){
  loginEmail(input:$input){
    id
    didRequest
    token
    avatar
    address
    adminAtt
  }
}
` 