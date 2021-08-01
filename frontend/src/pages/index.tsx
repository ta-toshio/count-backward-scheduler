import { useAppSelector } from '../app/hooks'
import { selectRootUser } from '../features/user/userSlice'
import Board from '../modules/board/templates/board'
import Top from '../modules/landing/templates/top'

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
