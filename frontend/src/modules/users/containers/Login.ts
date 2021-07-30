import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import firebase from '../../../services/firebase'
import {
  loginAction,
  postLoginAction,
  selectRootUser,
} from '../../../features/user/userSlice'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import Yup from '../../../app/yup'
import { useMutation } from '@apollo/client'
import { LOGIN_AS_SOCIAL } from '../../../queries/user'
import {
  LoginAsSocialMutation,
  LoginAsSocialMutationVariables,
} from '../../../generated/graphql'

const provider = new firebase.auth.GoogleAuthProvider()

const schema = Yup.object().shape({
  email: Yup.string().required().email(),
  password: Yup.string().required().min(6),
})

const useLogin = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [ready, setReady] = useState<boolean>(false)
  const { loginLoading, loginError } = useAppSelector(selectRootUser)
  const [loginAsSocial] = useMutation<
    LoginAsSocialMutation,
    LoginAsSocialMutationVariables
  >(LOGIN_AS_SOCIAL)
  const [loginErrorAsSocial, setLoginErrorAsSocial] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    const login = async () => {
      try {
        const { user } = await firebase.auth().getRedirectResult()
        if (!user) {
          setReady(true)
          return
        }

        const idToken = await firebase.auth().currentUser.getIdToken(true)

        const res = await loginAsSocial({
          variables: {
            input: {
              name: user.displayName,
              email: user.email,
              provider: 'google.com',
              id_token: idToken,
            },
          },
        })
        if (!res.errors) {
          dispatch(loginAction(res.data.loginAsSocial))
          router.replace('/')
        }
      } catch (e) {
        console.error(e.message)
        setLoginErrorAsSocial('認証に失敗しました')
      }
      setReady(true)
    }

    login()
  }, [])

  /**
   * Submit the form.
   */
  const submit = useCallback((data) => {
    const postData = {
      email: data.email,
      password: data.password,
    }
    dispatch(postLoginAction(postData)).then((data) => {
      if (data.payload && data.payload.id) {
        router.replace('/')
      }
    })
  }, [])

  const loginAsGoogle = () => {
    return firebase.auth().signInWithRedirect(provider)
  }

  return {
    ready,
    loginLoading,
    loginError,
    register,
    handleSubmit,
    formErrors,
    submit,
    loginAsGoogle,
    loginErrorAsSocial,
  }
}

export default useLogin
