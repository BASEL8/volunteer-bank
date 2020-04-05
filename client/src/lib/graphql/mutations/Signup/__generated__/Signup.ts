/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { SignupInputs } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: Signup
// ====================================================

export interface Signup_signup {
  __typename: "Viewer";
  id: string | null;
}

export interface Signup {
  signup: Signup_signup;
}

export interface SignupVariables {
  input: SignupInputs;
}
