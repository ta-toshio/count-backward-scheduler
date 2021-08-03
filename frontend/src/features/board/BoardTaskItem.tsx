import React from 'react'
import { numToHumanTime } from '../../utils/appMath'
import { ScheduledTask } from '../../generated/graphql'

type BoardTaskItemProps = {
  scheduledTask: ScheduledTask
  coef: number
}

const BoardTaskItem: React.FC<BoardTaskItemProps> = ({
  scheduledTask,
  coef,
}) => (
  <div className="board-task">
    <div className="board-task-title">
      <span>{scheduledTask.task.title}</span>
    </div>
    <div className="board-task-point">
      <span>can use: {numToHumanTime(scheduledTask.point / coef)}</span>
    </div>
    <div className="board-task-point">
      <span>
        original cost time:{' '}
        {numToHumanTime(scheduledTask.point || scheduledTask.task.point)}
      </span>
    </div>
    <div className="board-task-point">
      <span>
        this task total point: {numToHumanTime(scheduledTask.task.point)}
      </span>
    </div>
    <div className="board-task-point">
      <span>original total point: {scheduledTask.task.org_point} pt</span>
    </div>
  </div>
)

export default BoardTaskItem
