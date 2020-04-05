/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getCurrentMapData
// ====================================================

export interface getCurrentMapData_getCurrentMapData_helpRequests_result {
  __typename: "HelpRequest";
  title: string;
  description: string;
  id: string;
  by: string;
  language: string;
}

export interface getCurrentMapData_getCurrentMapData_helpRequests {
  __typename: "HelpRequests";
  total: number;
  result: getCurrentMapData_getCurrentMapData_helpRequests_result[];
}

export interface getCurrentMapData_getCurrentMapData_result_geoLocation {
  __typename: "GeoLocation";
  lat: number | null;
  lng: number | null;
}

export interface getCurrentMapData_getCurrentMapData_result {
  __typename: "Group";
  name: string;
  avatar: string;
  id: string;
  geoLocation: getCurrentMapData_getCurrentMapData_result_geoLocation;
}

export interface getCurrentMapData_getCurrentMapData {
  __typename: "UsersRequest";
  total: number;
  helpRequests: getCurrentMapData_getCurrentMapData_helpRequests | null;
  result: getCurrentMapData_getCurrentMapData_result[];
}

export interface getCurrentMapData {
  getCurrentMapData: getCurrentMapData_getCurrentMapData;
}

export interface getCurrentMapDataVariables {
  maxLng: number;
  minLng: number;
  maxLat: number;
  minLat: number;
  page: number;
  limit: number;
  language?: string | null;
  typeOfHelp?: string | null;
}
