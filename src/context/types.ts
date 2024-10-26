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
  birthDate: string | Date,
  nationalCode: string,
  firstName: string,
  fatherName: string,
  isDead: boolean | number,
  officiality: 'دارای شناسه اتباع' | 'بدون شناسه اتباع',
  lastName: string,
  matched: boolean | number,
  alive: boolean | number,
  phoneNumber : string,
  workPlace ?: string,
  nationality : 'ایرانی' | 'اتباع',
  category ?: 'اصناف' | 'حمل و نقل' | 'گردشگری',
  role ?: 'user' | 'manager',
  subgroup ?:string,
  image ?:string,
  identPict ?:string,
}

export interface IdentTypeWithJwt {
  birthDate: string | Date,
  nationalCode: string,
  firstName: string,
  fatherName: string,
  isDead: boolean | number,
  officiality: 'دارای شناسه اتباع' | 'بدون شناسه اتباع',
  lastName: string,
  matched: boolean | number,
  alive: boolean | number,
  phoneNumber : string,
  postal_code : string,
  address : string,
  workPlace : string,
  nationality : 'ایرانی' | 'اتباع',
  category : string,
  role : 'user' | 'manager',
  subgroup :string,
  position : string,
  senfCode : string,
  city ?: string,
  province ?: string,
  image :string,
  identPict :string,
  jwt : string,
  status ?: 'pending' | 'accepted' | 'declined' | '',
  id ?: number | string
}


export interface IranType{
  senfCode : string,
  position :  'مباشر' | 'مدیر' | 'کارمند' | 'کارگر' | 'صاحب پروانه',
  nationalCode: string,
  phoneNumber : string,
  nationality : 'ایرانی' | 'اتباع',
  officiality: 'دارای شناسه اتباع' | 'بدون شناسه اتباع',
  birthDate : string | Date,
}