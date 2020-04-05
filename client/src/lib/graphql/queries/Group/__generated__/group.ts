/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: group
// ====================================================

export interface group_group_groupMembers {
  __typename: "User";
  id: string;
  avatar: string | null;
  name: string;
}

export interface group_group_joinRequests {
  __typename: "User";
  id: string;
  avatar: string | null;
  contact: string | null;
  name: string;
}

export interface group_group {
  __typename: "Group";
  id: string;
  name: string;
  description: string;
  by: string;
  address: string;
  avatar: string;
  creatorId: string;
  groupMembers: group_group_groupMembers[];
  joinRequests: (group_group_joinRequests | null)[];
}

export interface group {
  group: group_group;
}

export interface groupVariables {
  id: string;
}
