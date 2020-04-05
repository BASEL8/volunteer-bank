import { gql } from 'apollo-boost'
export const AUTO_COMPLETE_CITY = gql`
mutation autoCompleteAddress($cityName:String!){
  autoCompleteAddress(cityName:$cityName)
}
` 