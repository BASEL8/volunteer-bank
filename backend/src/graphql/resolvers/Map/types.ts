import { HelpRequest, Group } from "./../../../lib/types";

export interface helpRequestsTypes {
  total: number,
  result: HelpRequest[]
}
export interface Groups {
  total: number
  result: Group[]
  helpRequests: helpRequestsTypes
}
export interface UserHelpRequests {
  total: number
  result: HelpRequest[]
}
export interface generateUserLocationArgs {
  lat: number
  lng: number
}
export interface generateUserAddressArgs {
  userAddress: string
}
export interface generateUserAddressResult {
  address: string
  geoLocation: generateUserLocationArgs
}