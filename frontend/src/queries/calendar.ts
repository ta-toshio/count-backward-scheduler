import { gql } from '@apollo/client'

export const taskFragment = gql`
  fragment taskFragment on Task {
    id
    user_id
    project_id
    title
    point
    org_point
    volume
    days
    created_at
    updated_at
  }
`

export const scheduledTaskFragment = gql`
  fragment scheduledTaskFragment on ScheduledTask {
    id
    user_id
    project_id
    task_id
    the_date
    point
    volume
    created_at
    updated_at
  }
`

export const CALENDAR = gql`
  query Calendar($start: Date, $end: Date) {
    calendar(start: $start, end: $end) {
      data {
        ...scheduledTaskFragment
        task {
          ...taskFragment
        }
      }
      info {
        prev
        next
      }
    }
  }
  ${scheduledTaskFragment}
  ${taskFragment}
`
