export interface LogInArgs {
  input: { code: string } | null;
}
export interface SignupInputs {
  name: string
  contact: string
  password: string
  avatar: string
}
export interface SignupArgs {
  input: SignupInputs
}
export interface LoginEmailInputs {
  contact: string
  password: string
}
export interface LoginEmailArgs {
  input: LoginEmailInputs
}