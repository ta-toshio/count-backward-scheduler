import Login from '../modules/users/templates/Login'
import { redirectHoc } from '../app/userProvider'

const auth = {
  require: false,
  redirect: '',
  redirectIfLoggedIn: '/',
}

export default redirectHoc(auth)(Login)
