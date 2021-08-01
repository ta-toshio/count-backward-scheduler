import { NextPage } from 'next'
import Layout from '../components/Layout'

const Board1: NextPage = () => {
  return (
    <Layout>
      <div className="project-main">
        <div className="project-content">
          <div className="project-board project-board--main">
            <div className="project-board__content" id="board-content-div">
              <div
                className="project-board__content-body list-sortable ui-sortable"
                id="task-area"
                style={{ width: '1960px' }}
              >
                {[1, 2, 3, 4].map((v) => (
                  <div
                    key={`list-${v}`}
                    className="list-item-sortable"
                    id="list-2358087"
                  >
                    <div
                      className="box  handle-list-item-sortable"
                      id="list-item-2358087"
                      data-list-id={2358087}
                      data-id={2358087}
                      style={{ borderTop: 'solid 10px #4DABFF' }}
                    >
                      <div
                        className="box__top box__top--grabbable"
                        data-id={2358087}
                      >
                        <div className="box__title">
                          <h2 className="box__title-name list-name list-name-view-2358087">
                            <span className="tooltips">Icebox</span>
                            <span id="list-count" style={{ color: '#50acff' }}>
                              2
                            </span>
                          </h2>
                        </div>
                        <button className="btn button button--light button--full box__add-task add-task">
                          <i className="icon-fonts icon-fonts--plus button__icon" />
                          タスクを追加
                        </button>
                      </div>
                      <div className="box__list-task task-sortable task-list list-2358087 ui-sortable">
                        {[
                          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                          17,
                        ].map((v) => (
                          <div
                            key={`task-${v}`}
                            className="task-item-sortable task-item taskmenu ui-droppable"
                          >
                            <div className="pointer-cursor task-view-detail ">
                              <div className="task-panel handle-task-item-sortable">
                                <div className="task-item__title-name">
                                  <h5 className="task-item__name excerpt-block">
                                    {' '}
                                    既存のサイトを真似て作る
                                    既存のサイトを真似て作る
                                  </h5>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                <div>
                  <div className="box box-add-list add-more-list add-new-list">
                    <button
                      className="btn button button--light button--large button--full"
                      type="button"
                    >
                      <i className="icon-fonts icon-fonts--plus button__icon" />
                      リストを追加
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Board1
