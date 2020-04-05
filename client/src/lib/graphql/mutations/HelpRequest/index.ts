import { gql } from 'apollo-boost'
export const HELP_REQUEST = gql`
  mutation createHelpRequest($input:HelpRequestInputs!){
    createHelpRequest(input:$input){
      id
    }
  }
`