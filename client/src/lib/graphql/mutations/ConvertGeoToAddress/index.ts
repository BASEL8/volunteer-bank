import { gql } from 'apollo-boost'
export const GENERATE_ADDRESS = gql`
mutation generateUserLocation($lng:Float!,$lat:Float!){
   generateUserLocation(lng:$lng,lat:$lat)
}
`