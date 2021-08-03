import React from 'react'
import { NextPage } from 'next'
import Layout from '../../components/Layout'
import useBoard from './useBoard'
import ScreenSpinner from '../../components/spinner/Spinner'
import BoardTaskItem from './BoardTaskItem'
import useProject from '../app/useProject'
import { getCoefFromProject } from '../../utils/appUtil'

const Board: NextPage = () => {
  const {
    loading,
    data,
    calendarData,
    prevCalendarData,
    fetchMoreHandler,
    fetchMoreLoading,
  } = useBoard()
  const { myProjects } = useProject()
  if (loading) return <ScreenSpinner />

  return (
    <Layout>
      <main className="board-main">
        <div className="board-canvas">
          <div className="board scrollbar">
            {prevCalendarData && Object.keys(prevCalendarData).length > 0 && (
              <div className="board-line-wrapper">
                <div className="board-line">
                  <div className="board-line-title">Past</div>
                  <div className="board-line-content scrollbar">
                    {Object.keys(prevCalendarData).map((yearMonth) => (
                      <React.Fragment key={`prev-cal-${yearMonth}`}>
                        {Object.keys(prevCalendarData[yearMonth]).map(
                          (week) => (
                            <React.Fragment
                              key={`prev-cal-${yearMonth}-${week}`}
                            >
                              <div className="board-line-content-title">
                                {week}
                              </div>
                              {Object.keys(
                                prevCalendarData[yearMonth][week]
                              ).map((theDate) => (
                                <React.Fragment
                                  key={`prev-cal-${yearMonth}-${week}-${theDate}-${theDate}`}
                                >
                                  <div className="board-line-content-subtitle">
                                    {theDate}
                                  </div>
                                  {prevCalendarData[yearMonth][week][
                                    theDate
                                  ].map((scheduledTask, i) => (
                                    <BoardTaskItem
                                      key={`prev-cal-${yearMonth}-${week}-${theDate}-${theDate}-${i}`}
                                      scheduledTask={scheduledTask}
                                      coef={getCoefFromProject(
                                        scheduledTask.task.project_id,
                                        myProjects && myProjects.data
                                      )}
                                    />
                                  ))}
                                </React.Fragment>
                              ))}
                            </React.Fragment>
                          )
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {Object.keys(calendarData).map((yearMonth) => (
              <div
                key={`item-wrapper-${yearMonth}`}
                className="board-line-wrapper"
              >
                <div className="board-line">
                  <div className="board-line-title">{yearMonth}月</div>
                  <div className="board-line-content scrollbar">
                    {Object.keys(calendarData[yearMonth]).map((week) => (
                      <React.Fragment key={`cal-${yearMonth}-${week}`}>
                        <div className="board-line-content-title">{week}</div>
                        {Object.keys(calendarData[yearMonth][week]).map(
                          (theDate) => (
                            <React.Fragment
                              key={`cal-${yearMonth}-${week}-${theDate}-${theDate}`}
                            >
                              <div className="board-line-content-subtitle">
                                {theDate}
                              </div>
                              {calendarData[yearMonth][week][theDate].map(
                                (scheduledTask, i) => (
                                  <BoardTaskItem
                                    key={`cal-${yearMonth}-${week}-${theDate}-${theDate}-${i}`}
                                    scheduledTask={scheduledTask}
                                    coef={getCoefFromProject(
                                      scheduledTask.task.project_id,
                                      myProjects && myProjects.data
                                    )}
                                  />
                                )
                              )}
                            </React.Fragment>
                          )
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="board-line-footer" />
                </div>
              </div>
            ))}
            {data && data.calendar && data.calendar.info.next && (
              <div className="board-line-wrapper">
                <div className="board-line more">
                  <div className="board-line-title" />
                  <div className="board-line-content">
                    <button
                      onClick={fetchMoreHandler}
                      disabled={fetchMoreLoading}
                    >
                      もっと読み込む
                    </button>
                  </div>
                  <div className="board-line-footer" />
                </div>
              </div>
            )}
          </div>
        </div>
        {/* board-canvas */}
      </main>
    </Layout>
  )
}

export default Board
