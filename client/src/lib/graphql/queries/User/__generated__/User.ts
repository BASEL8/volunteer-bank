/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: User
// ====================================================

export interface User_user_memberAtt {
  __typename: "Group";
  avatar: string;
  id: string;
}

export interface User_user_adminAtt {
  __typename: "Group";
  name: string;
  id: string;
}

export interface User_user_geoLocation {
  __typename: "GeoLocation";
  lat: number | null;
  lng: number | null;
}

export interface User_user_helpRequests_result {
  __typename: "HelpRequest";
  title: string;
  description: string;
}

export interface User_user_helpRequests {
  __typename: "HelpRequests";
  total: number;
  result: User_user_helpRequests_result[];
}

export interface User_user {
  __typename: "User";
  id: string;
  name: string;
  avatar: string | null;
  contact: string | null;
  address: string | null;
  salt: string | null;
  verifiedAccount: boolean | null;
  memberAtt: User_user_memberAtt[] | null;
  adminAtt: User_user_adminAtt | null;
  geoLocation: User_user_geoLocation | null;
  helpRequests: User_user_helpRequests | null;
}

export interface User {
  user: User_user;
}

export interface UserVariables {
  id: string;
  helpRequestsPage: number;
  limit: number;
}
