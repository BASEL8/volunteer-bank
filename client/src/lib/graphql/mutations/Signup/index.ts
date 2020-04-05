import { gql } from 'apollo-boost'
export const SIGNUP = gql`
mutation Signup($input:SignupInputs!){
  signup(input:$input){
    id
  }
}
` 