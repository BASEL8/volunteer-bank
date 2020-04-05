import { gql } from 'apollo-boost'

export const MAP_DATA = gql`
query getCurrentMapData($maxLng:Float!,$minLng:Float!,$maxLat:Float!,$minLat:Float!,$page:Int!,$limit:Int!,$language:String,$typeOfHelp:String){
   getCurrentMapData(maxLng:$maxLng,minLng:$minLng,maxLat:$maxLat,minLat:$minLat,page:$page,limit:$limit,language:$language,typeOfHelp:$typeOfHelp){
      total
      helpRequests{
       total
       result {
          title
          description
          id
          by
          language
        }
      }
      result { 
        name
        avatar
        id
        geoLocation{
          lat 
           lng
        }
        
      }
  }
}
`