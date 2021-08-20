import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import isEmpty from 'lodash.isempty'
import {
  startOfMonth,
  endOfWeek,
  subMonths,
  getWeekOfMonth,
  parse,
  format,
  addMonths,
  endOfMonth,
  addDays,
} from 'date-fns'
import { CALENDAR } from '../../queries/calendar'
import {
  CalendarQuery,
  CalendarQueryVariables,
  ScheduledTaskFragmentFragment,
} from '../../generated/graphql'
import { getCalendarArray } from '../../utils/appDate'

const startDate = startOfMonth(new Date())
const endDate = endOfMonth(addMonths(startDate, 2))
const startDateStr = format(startDate, 'yyyy-MM-dd')
const endDateStr = format(endDate, 'yyyy-MM-dd')

const prevEndDate = endOfMonth(subMonths(startDate, 1))
const prevStartDate = subMonths(startOfMonth(prevEndDate), 2)
const prevStartDateStr = format(prevStartDate, 'yyyy-MM-dd')
const prevEndDateStr = format(prevEndDate, 'yyyy-MM-dd')

const formatScheduleData = (data) => {
  const formattedData = {}
  data?.calendar?.data?.forEach((scheduledTask) => {
    const theDate = parse(scheduledTask.the_date, 'yyyy-MM-dd', new Date())
    const year = theDate.getFullYear()
    const month = theDate.getMonth() + 1
    const key = `${year}-${month}`
    if (!formattedData[key]) {
      formattedData[key] = {}
    }

    const weekNum = getWeekOfMonth(theDate)
    if (!formattedData[key][weekNum]) {
      formattedData[key][weekNum] = []
    }
    formattedData[key][weekNum].push(scheduledTask)
  })

  const result = {}
  for (const [k, v] of Object.entries(formattedData)) {
    result[k] = {}

    const cal = getCalendarArray(
      new Date(parseInt(k.split('-')[0]), parseInt(k.split('-')[1]) - 1, 1)
    )

    // const maxWeekIndex = Math.max(
    //   ...Object.keys(formattedData[k]).map((i) => parseInt(i))
    // )

    // kk: week number of month 1|2|3|4|5
    for (const [kk, vv] of Object.entries(v)) {
      const startDateOfWeek =
        kk === '1' ? startOfMonth(cal[0][6]) : cal[parseInt(kk) - 1][0]
      const endOfDateWeek =
        kk === (cal.length - 1).toString()
          ? endOfMonth(cal[cal.length - 1][0])
          : endOfWeek(startDateOfWeek)

      const week = `${format(startDateOfWeek, 'yyyy-MM-dd')} - ${format(
        endOfDateWeek,
        'yyyy-MM-dd'
      )}`

      result[k][week] = {}

      for (const [, vvv] of Object.entries<ScheduledTaskFragmentFragment>(vv)) {
        // console.log(vvv)
        const theDate = vvv.the_date
        if (!result[k][week][theDate]) {
          result[k][week][theDate] = []
        }
        result[k][week][theDate].push(vvv)
      }
    }
  }
  return result
}

const useBoard = () => {
  const { loading, data, fetchMore } = useQuery<
    CalendarQuery,
    CalendarQueryVariables
  >(CALENDAR, {
    variables: {
      start: startDateStr,
      end: endDateStr,
    },
  })

  const {
    // loading: prevLoading,
    // error: prevError,
    data: prevData,
    // fetchMore: prevFetchMore,
  } = useQuery<CalendarQuery, CalendarQueryVariables>(CALENDAR, {
    variables: {
      start: prevStartDateStr,
      end: prevEndDateStr,
    },
  })

  const [fetchMoreLoading, setFetchMoreLoading] = useState<boolean>(false)

  const [calendarData, setCalendarData] = useState<{}>({})
  const [prevCalendarData, setPrevCalendarData] = useState<{}>({})
  const [nextDate, setNextDate] = useState<Date>(endDate)
  // const [prevDate, setPrevDate] = useState<Date>(prevStartDate)

  useEffect(() => {
    setCalendarData(formatScheduleData(data))
  }, [data])

  useEffect(() => {
    setPrevCalendarData(formatScheduleData(prevData))
  }, [prevData])

  const fetchMoreHandler = async (e) => {
    e.preventDefault()
    setFetchMoreLoading(true)
    const start = addDays(nextDate, 1)
    const end = endOfMonth(addMonths(start, 2))
    try {
      await fetchMore({
        variables: {
          start: format(start, 'yyyy-MM-dd'),
          end: format(end, 'yyyy-MM-dd'),
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev
          return Object.assign({}, prev, {
            calendar: {
              ...prev.calendar,
              data: isEmpty(fetchMoreResult.calendar.data)
                ? [...prev.calendar.data]
                : [...prev.calendar.data, ...fetchMoreResult.calendar.data],
              info: {
                ...fetchMoreResult.calendar.info,
              },
            },
          })
        },
      })
    } catch (e) {
      console.warn(e)
    }
    setFetchMoreLoading(false)
    setNextDate(end)
  }

  // const fetchPreviousHandler = async () => {}

  return {
    loading,
    data,
    fetchMoreHandler,
    fetchMoreLoading,
    calendarData,
    prevCalendarData,
  }
}

export default useBoard
