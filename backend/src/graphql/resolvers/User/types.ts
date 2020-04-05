import { HelpRequest } from "./../../../lib/types";
export interface UserArgs {
  id: string
}
export interface CreateHelpRequestInput {
  title: string
  description: string
  language: string
  type: string
}
export interface CreateHelpRequestArgs {
  input: CreateHelpRequestInput
}
export interface UserHelpRequests {
  total: number
  result: HelpRequest[]
}
