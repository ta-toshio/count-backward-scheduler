import Login from '../features/user/Login'
import { redirectHoc } from '../app/userProvider'

const auth = {
  require: false,
  redirect: '',
  redirectIfLoggedIn: '/',
}

export default redirectHoc(auth)(Login)
