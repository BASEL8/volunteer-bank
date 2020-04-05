/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { HelpRequestInputs } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: createHelpRequest
// ====================================================

export interface createHelpRequest_createHelpRequest {
  __typename: "HelpRequest";
  id: string;
}

export interface createHelpRequest {
  createHelpRequest: createHelpRequest_createHelpRequest;
}

export interface createHelpRequestVariables {
  input: HelpRequestInputs;
}
