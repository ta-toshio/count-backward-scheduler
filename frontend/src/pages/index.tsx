import { useAppSelector } from '../app/hooks'
import { selectRootUser } from '../features/user/userSlice'
import Board from '../modules/board/templates/Board'
import Top from '../modules/landing/templates/Top'

const IndexPage = () => {
  const { isAuthenticated } = useAppSelector(selectRootUser)

  return (
    <>
      {isAuthenticated && <Board />}
      {!isAuthenticated && <Top />}
    </>
  )
}

export default IndexPage
