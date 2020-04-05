/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createGroup
// ====================================================

export interface createGroup_createGroup {
  __typename: "Group";
  id: string;
}

export interface createGroup {
  createGroup: createGroup_createGroup;
}

export interface createGroupVariables {
  name: string;
  description: string;
  avatar: string;
}
