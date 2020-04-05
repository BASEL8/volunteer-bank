export interface Viewer {
  id: string | null
  token: string | null
  avatar: string | null
  didRequest: boolean
  address?: string | null
  adminAtt?: boolean
}