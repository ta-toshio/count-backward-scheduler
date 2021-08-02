import { useAppSelector } from '../app/hooks'
import { selectRootUser } from '../features/user/userSlice'
import Board from '../modules/board/templates/Board'
import Top from '../modules/landing/templates/Top'
import ScreenSpinner from '../components/spinner/Spinner'

const IndexPage = () => {
  const { isAuthenticated, getUserLoaded } = useAppSelector(selectRootUser)
  if (!getUserLoaded) return <ScreenSpinner />

  return (
    <>
      {isAuthenticated && <Board />}
      {!isAuthenticated && <Top />}
    </>
  )
}

export default IndexPage
