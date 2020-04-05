/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: generateGeoAddress
// ====================================================

export interface generateGeoAddress_generateGeoAddress_geoLocation {
  __typename: "GeoLocation";
  lat: number | null;
  lng: number | null;
}

export interface generateGeoAddress_generateGeoAddress {
  __typename: "generateUserAddressResult";
  geoLocation: generateGeoAddress_generateGeoAddress_geoLocation | null;
}

export interface generateGeoAddress {
  generateGeoAddress: generateGeoAddress_generateGeoAddress;
}

export interface generateGeoAddressVariables {
  userAddress: string;
}
