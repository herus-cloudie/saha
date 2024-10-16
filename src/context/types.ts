export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type UserDataType = {
  id: number
  role: string
  email: string
  fullName: string
  username: string
  password: string
  avatar?: string | null
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
}

export interface IdentType {
  firstName: string,
  fatherName: string,
  isDead: string,
  lastName: string,
  matched: string,
  alive: string,
  nationalCode: string
}

export interface IdentTypeWithJwt {
  firstName: string,
  fatherName: string,
  isDead: string,
  lastName: string,
  matched: string,
  alive: string,
  nationalCode: string,
  jwt : string
}
