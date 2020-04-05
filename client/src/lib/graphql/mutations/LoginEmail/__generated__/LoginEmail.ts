/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LoginEmailInputs } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: LoginEmail
// ====================================================

export interface LoginEmail_loginEmail {
  __typename: "Viewer";
  id: string | null;
  didRequest: boolean;
  token: string | null;
  avatar: string | null;
  address: string | null;
}

export interface LoginEmail {
  loginEmail: LoginEmail_loginEmail;
}

export interface LoginEmailVariables {
  input?: LoginEmailInputs | null;
}
