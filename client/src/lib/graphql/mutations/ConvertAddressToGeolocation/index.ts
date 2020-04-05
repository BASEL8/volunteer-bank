import { gql } from 'apollo-boost'

export const GENERATE_USER_GEOLOCATION = gql`
mutation generateUserAddress($userAddress:String!){
   generateUserAddress(userAddress:$userAddress){
      address
      geoLocation {
         lat
         lng
      }
   }
}
`
export const GENERATE_GEOLOCATION = gql`
mutation generateGeoAddress($userAddress:String!){
   generateGeoAddress(userAddress:$userAddress){
      geoLocation {
         lat
         lng
      }
   }
}
`