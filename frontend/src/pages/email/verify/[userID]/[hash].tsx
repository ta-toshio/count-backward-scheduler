import { NextRouter, useRouter } from 'next/router'
import type { NextPage } from 'next'
import { ReactElement, useEffect, useState } from 'react'
import httpClient from '../../../../app/httpClient'

export const requestVerifyEmail = async (
  userID: string,
  hash: string,
  expires: string,
  signature: string
) => {
  try {
    /**
     * Construct the url the api expects.
     * It must be /email/verify/USERID/HASH?expires=EXPIRES&signature=SIGNATURE
     */
    const requestURL = `/email/verify/${userID}/${hash}?expires=${expires}&signature=${signature}`

    // Send req to api.
    const res = await httpClient.get(requestURL)

    // Success.
    if (res.status === 204 || res.status === 202) {
      return {
        success: true,
        error: '',
      }
    }
    // Error.
    else {
      return {
        success: false,
        error: 'Something went wrong',
      }
    }
  } catch (error) {
    if (error.response && error.response.data) {
      return {
        success: false,
        error: error.response.data.message,
      }
    } else {
      return {
        success: false,
        error: 'Sorry, something went wrong.',
      }
    }
  }
}

const VerifyEmail: NextPage = (): ReactElement => {
  const router: NextRouter = useRouter()

  const { expires, signature, userID, hash } = router.query

  // State.
  const [state, setState] = useState<{
    error: string
    loading: boolean
  }>({
    error: '',
    loading: true,
  })

  // Send api request to api upon mount of the component.
  useEffect(() => {
    const verify = async () => {
      const res = await requestVerifyEmail(
        userID as string,
        hash as string,
        expires as string,
        signature as string
      )

      // Successful verification.
      if (res.success) {
        setState({
          ...state,
          loading: false,
          error: '',
        })

        // Redirect to Home route of the user after 3 seconds.
        setTimeout(() => {
          router.replace('/logged-in')
        }, 3000)
        return
      }

      // Set error message if verification failed.
      if (res.error) {
        setState({
          ...state,
          loading: false,
          error: res.error,
        })
      }
    }
    if (userID && hash && expires && signature) {
      verify()
    }
  }, [userID, hash, expires, signature])

  /**
   * Set the text for the H1 header depending on verification status.
   */
  const headerText = (): string => {
    if (state.loading) {
      return 'We are currently validating your email address...'
    } else if (!state.loading && !state.error) {
      return 'Verification successfull!'
    }
    return 'Verification failed!'
  }
  const header = headerText()

  /**
   * Set the text for the paragraph depending on verification status.
   */
  const paragraphText = (): string => {
    if (state.loading) {
      return ''
    } else if (!state.loading && !state.error) {
      return 'Perfect! You will be redirected shortly....'
    }
    return 'Sorry, something went wrong!'
  }

  const paragraph: string = paragraphText()

  // Return statement.
  return (
    <div>
      <div>{header}</div>
      <div>{paragraph}</div>
    </div>
  )
}

export default VerifyEmail
