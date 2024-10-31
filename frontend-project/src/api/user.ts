import instance from '.'
import { LoginUser } from '../views/login/type'

export function login(data: LoginUser) {
  return instance.request<{ data: any; message: string; code: number }>({
    url: '/user/login',
    method: 'POST',
    data,
  })
}
