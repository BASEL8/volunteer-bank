/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: generateUserAddress
// ====================================================

export interface generateUserAddress_generateUserAddress_geoLocation {
  __typename: "GeoLocation";
  lat: number | null;
  lng: number | null;
}

export interface generateUserAddress_generateUserAddress {
  __typename: "generateUserAddressResult";
  address: string;
  geoLocation: generateUserAddress_generateUserAddress_geoLocation | null;
}

export interface generateUserAddress {
  generateUserAddress: generateUserAddress_generateUserAddress;
}

export interface generateUserAddressVariables {
  userAddress: string;
}
