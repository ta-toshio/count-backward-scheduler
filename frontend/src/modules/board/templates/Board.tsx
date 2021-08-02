import React from 'react'
import { NextPage } from 'next'
import Layout from '../../../components/Layout'
import useBoard from '../containers/useBoard'
import ScreenSpinner from '../../../components/spinner/Spinner'

const Item = ({ scheduledTask }) => (
  <span className="board-task">{scheduledTask.task.title}</span>
)

const Board: NextPage = () => {
  const { loading, data, calendarData, prevCalendarData, fetchMoreHandler } =
    useBoard()
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
                                    <Item
                                      key={`prev-cal-${yearMonth}-${week}-${theDate}-${theDate}-${i}`}
                                      scheduledTask={scheduledTask}
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
                                  <Item
                                    key={`cal-${yearMonth}-${week}-${theDate}-${theDate}-${i}`}
                                    scheduledTask={scheduledTask}
                                  />
                                )
                              )}
                            </React.Fragment>
                          )
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="board-line-footer"></div>
                </div>
              </div>
            ))}
            {data && data.calendar && data.calendar.info.next && (
              <div className="list-wrapper">
                <div className="list">
                  <div className="list-header"></div>
                  <div className="list-cards">
                    <button onClick={fetchMoreHandler}>もっと読み込む</button>
                  </div>
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
