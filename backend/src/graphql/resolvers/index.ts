import merge from 'lodash.merge'
import { viewerResolvers } from "./Viewer";
import { userResolvers } from './User'
import { mapResolvers } from './Map'
import { groupsResolvers } from './Group'
export const resolvers = merge(
  viewerResolvers,
  userResolvers,
  mapResolvers,
  groupsResolvers
)