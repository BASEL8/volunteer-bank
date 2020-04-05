import { Timestamp } from "mongodb";
import { gql } from 'apollo-server-express'
export const typeDefs = gql`

 type HelpRequest {
   id:ID!
  title: String!
  description: String!
  by: String!
  type: String!
  language:String!
}
type HelpRequests {
  total: Int!
  result: [HelpRequest!]!
}

type UsersRequest {
  total:Int!
  result:[Group!]!
  helpRequests:HelpRequests
}
type GeoLocation {
  lat: Float
  lng: Float
}
type generateUserAddressResult {
  address:String!
  geoLocation : GeoLocation
}
type User {
  id: ID!
  token: String!
  name: String!
  avatar: String
  contact: String
  salt:String
  helpRequests(limit: Int!, page: Int!):HelpRequests
  wantToHelp: HelpRequests
  authorized: Boolean
  address:String
  geoLocation:GeoLocation
  verifiedAccount:Boolean
  adminAtt:Group
  memberAtt : [Group!]
  joinRequests: [String!]
}
type Member {
  id: String!
  languages: [String!]!
}
type Group {
  id:ID!
  name:String!
  admins:[String!]!
  groupMembers:[User!]!
  address:String!
  geoLocation:GeoLocation!
  by:String!
  creatorId:String!
  description:String!
  avatar:String!
  joinRequests:[User]!
}
 type Viewer {
    id: ID
    token: String
    avatar: String
    didRequest: Boolean!
    address:String
    adminAtt:Boolean
  }
   input LogInInput {
    code: String!
  }
  input HelpRequestInputs {
 title: String!
  description: String!
  language: String!
  type: String!
  }
  input SignupInputs {
    name:String!
    contact:String!
    password:String!
    avatar:String!
  }
  input LoginEmailInputs {
    contact:String!
    password:String!
  }

  type Query {
    authUrl: String!
    user(id: ID!): User!
    getCurrentMapData(maxLat:Float!,minLat:Float!,maxLng:Float!,minLng:Float!,limit:Int!,page:Int!,language:String,typeOfHelp:String):UsersRequest!
    group(id:ID!):Group!
  }
  type Mutation {
    logIn(input: LogInInput): Viewer!
    logOut: Viewer!
    createHelpRequest(input: HelpRequestInputs!):HelpRequest!
    signup(input:SignupInputs):Viewer!
    loginEmail(input:LoginEmailInputs):Viewer!
    generateUserLocation(lat:Float!,lng:Float!):String!
    generateUserAddress(userAddress:String):generateUserAddressResult!
    generateGeoAddress(userAddress:String):generateUserAddressResult!
    autoCompleteAddress(cityName:String!):[String!]!
    createGroup(name:String!,description:String!,avatar:String!):Group!
    joinGroup(id:String!,languages:[String!]!):Viewer!
    verifyRequest(id:String!,groupId:String!):Group!
  }

`