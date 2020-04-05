import { Collection, ObjectId, Timestamp } from 'mongodb'

export interface Viewer {
  _id?: string;
  token?: string;
  avatar?: string;
  walletId?: string;
  didRequest: boolean;
  address?: string;
  adminAtt?: boolean
}
export interface GeoLocation {
  lat: number
  lng: number
}
export interface User {
  _id: string;
  token: string;
  name: string;
  avatar: string;
  contact: string;
  helpRequests: ObjectId[];
  wantToHelp: ObjectId[];
  authorized?: boolean;
  address?: string
  geoLocation?: GeoLocation
  salt?: string | null
  verifiedAccount?: boolean
  adminAtt?: string
  memberAtt: string[]
  joinRequests: string[]

}

export interface TimeToHelpIndexMonth {
  [key: string]: boolean;
}
export interface TimeToHelpIndexYear {
  [key: string]: TimeToHelpIndexMonth;
}
export interface TimeToHelpIndex {
  [key: string]: TimeToHelpIndexYear;
}
export interface HelpRequest {
  _id: ObjectId;
  title: string;
  description: string;
  by: string;
  type: string;
  language: string;
}
export interface Member {
  id: string
  languages: string[]
}
export interface Group {
  _id: string;
  name: string;
  admins: string[];
  groupMembers: Member[];
  address: string
  geoLocation: GeoLocation
  by: string
  description: string
  avatar: string
  joinRequests: Member[]
}
export interface Database {
  users: Collection<User>;
  helpRequests: Collection<HelpRequest>;
  groups: Collection<Group>;
}