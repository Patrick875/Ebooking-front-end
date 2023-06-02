import dayjs from 'dayjs'
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)

function sortByDate(a, b) {
  const date1 = new Date(a.date)
  const date2 = new Date(b.date)
  return date2.getTime() - date1.getTime()
}

export const datesInRange = function (startDate, endDate, steps = 1) {
  const dateArray = []
  let currentDate = new Date(startDate)

  while (currentDate <= new Date(endDate)) {
    dateArray.push(new Date(currentDate))
    // Use UTC date to prevent problems with time zones and DST
    currentDate.setUTCDate(currentDate.getUTCDate() + steps)
  }

  return dateArray
}
export const datesInRangeWithUnix = function (startDate, endDate, steps = 1) {
  const dateArray = []
  let currentDate = new Date(startDate)
  endDate = new Date(endDate)

  while (dayjs(currentDate).isSameOrBefore(dayjs(endDate), 'date')) {
    // let date = new Date(currentDate)
    // date.setUTCHours(0, 0, 0, 0)
    // const utcDateWithoutTime = date.toISOString().slice(0, 10)
    // dateArray.push(utcDateWithoutTime)
    // // Use UTC date to prevent problems with time zones and DST
    // currentDate.setUTCDate(currentDate.getUTCDate() + steps)
    dateArray.push(dayjs(currentDate).format('YYYY-MM-DD'))
    currentDate = dayjs(currentDate).add(1, 'day')
  }

  return dateArray
}

export const getUTCDateWithoutHours = function (date) {
  let newDate = new Date(date)
  // newDate.setUTCHours(0, 0, 0, 0)
  const utcDateWithoutTime = newDate.toISOString().slice(0, 10)
  return utcDateWithoutTime
}
export const getAllRemoveDates = function (service) {
  const allDates = service.Reservations.map((e) => {
    if (e.status !== 'canceled') {
      return {
        dateIn: new Date(e.checkIn).toString(),
        dateOut: new Date(e.checkOut).toString(),
      }
    }
    return []
  })

  const nowDates = []
  const removeDates =
    allDates.length !== 0
      ? allDates.map((date) => {
          return datesInRange(date.dateIn, date.dateOut)
        })
      : allDates

  if (removeDates.length !== 0) {
    let justDates = removeDates.map((e) => e.map((ele) => nowDates.push(ele)))

    const uniqueDates = nowDates.filter(
      (value, index, array) => array.indexOf(value) === index,
    )

    return uniqueDates
  }
  return []
}

export const sortingWithDates = function (data) {
  return data.sort(sortByDate, true)
}

export function sumAmountsByCurrency(transactions) {
  const sumByCurrency = {}
  for (const transaction of transactions) {
    const currency = transaction.currency
    const amount = transaction.amount
    if (sumByCurrency.hasOwnProperty(currency)) {
      sumByCurrency[currency] += Number(amount)
    } else {
      sumByCurrency[currency] = Number(amount)
    }
  }
  return sumByCurrency
}

export function getRoomStatus(room) {
  let allReservationDates = []
  let checkIn, checkOut
  let confirmedReservations =
    room.Reservations && room.Reservations.length !== 0
      ? room.Reservations.filter(
          (reserv) => reserv.status === 'confirmed' && reserv.roomId,
        )
      : []
  if (confirmedReservations.length === 0) {
    return { status: 'VACANT' }
  } else {
    let reservationDates = confirmedReservations.map((reserv) => {
      allReservationDates.push([
        getUTCDateWithoutHours(reserv.checkIn),
        getUTCDateWithoutHours(reserv.checkOut),
      ])
      return reserv
    })

    let datesWithinEachReservation =
      allReservationDates && allReservationDates.length !== 0
        ? allReservationDates.map((datArr) => {
            let dates = datesInRangeWithUnix(datArr[0], datArr[1])
            return {
              dateIn: datArr[0],
              dateOut: datArr[1],
              datArr: [...dates],
            }
          })
        : []

    let allDates = []

    datesWithinEachReservation =
      datesWithinEachReservation && datesWithinEachReservation.length !== 0
        ? datesWithinEachReservation.map(({ datArr, dateIn, dateOut }) => {
            if (
              datesInRangeWithUnix(dateIn, dateOut).includes(
                getUTCDateWithoutHours(new Date()),
              )
            ) {
              checkIn = dateIn
              checkOut = dateOut
            }
            for (let i = 0; i < datArr.length; i++) {
              allDates.push(datArr[i])
            }
            return datArr
          })
        : datesWithinEachReservation

    if (
      allDates &&
      allDates.length !== 0 &&
      allDates.includes(getUTCDateWithoutHours(new Date()))
    ) {
      return { status: 'OCCUPIED', checkIn, checkOut }
    } else {
      return { status: 'VACANT' }
    }
  }
}
