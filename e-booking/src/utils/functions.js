import dayjs from 'dayjs'
import { parseISO } from 'date-fns'

const isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)

function sortByDate(a, b) {
  const date1 = a.date ? new Date(a.date) : new Date(a.createdAt)
  const date2 = b.date ? new Date(b.date) : new Date(b.createdAt)
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
export const getEventDates = function (events) {
  const allDates = events.map((e) => {
    if (e.status !== 'canceled') {
      return {
        ...e,
        dateIn: new Date(e.startDate).toString(),
        dateOut: new Date(e.endDate).toString(),
      }
    }
    return []
  })

  const removeDates =
    allDates.length !== 0
      ? allDates.map((date) => {
          return {
            ...date,
            dates: datesInRange(date.dateIn, date.dateOut),
          }
        })
      : allDates

  return removeDates
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

// Output: [sequelizeDate1, sequelizeDate2, sequelizeDate3, ...]

export function getAllDates(service) {
  return service.Reservations.map((reservation) => {
    const lastDateIns = reservation.DatesIns[reservation.DatesIns.length - 1]
    return lastDateIns
      ? lastDateIns.datesIn.map((dateString) => parseISO(dateString))
      : []
  }).flat()
}

export function groupElementsByTitle(arr) {
  const groupedElements = {}

  // Group elements by title
  arr.forEach((element) => {
    const title = element.title
    if (groupedElements[title]) {
      groupedElements[title].push(element)
    } else {
      groupedElements[title] = [element]
    }
  })

  // Convert object values to arrays
  const result = Object.values(groupedElements)

  return result
}

export function removeObjectsWithEmptyProperties(array) {
  return array.filter((obj) => {
    for (const key in obj) {
      if (
        key !== 'date' &&
        key !== 'comment' &&
        obj.hasOwnProperty(key) &&
        obj[key] === ''
      ) {
        return false
      }
    }
    return true
  })
}

export function multiplyCommonValues(obj1, obj2) {
  const result = {}

  for (const key in obj1) {
    if (
      obj1.hasOwnProperty(key) &&
      obj2.hasOwnProperty(key) &&
      obj1[key] &&
      obj2[key]
    ) {
      result[key] = Number(obj1[key] * obj2[key])
    }
  }

  return result
}

export function sumObjectValues(obj) {
  let sum = 0
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'number') {
        sum += obj[key]
      }
    }
  }
  return sum
}
export function mergeObjects(obj1, obj2) {
  const commonKeys = Object.keys(obj1).filter(
    (key) => obj2.hasOwnProperty(key) && obj1[key] && obj2[key],
  )
  const mergedObject = {}

  commonKeys.forEach((key) => {
    const value1 = Number(obj1[key])
    const value2 = Number(obj2[key])

    const price = value1 > value2 ? value1 : value2
    const number = value1 < value2 ? value1 : value2

    mergedObject[key] = { price, number }
  })

  return mergedObject
}

export function processObjects(array) {
  for (let obj of array) {
    const { name, price } = obj
    obj.description = name
    obj.unitPrice = price
  }

  return array
}

export function filterDateDuplicates(dates) {
  // Get the date part of each date object.
  const dateOnly = dates.map((date) => date.toDateString())

  // Create a set of unique date strings.
  const uniqueDateStrings = new Set(dateOnly)

  // Create a new array of unique dates.
  const uniqueDates = []
  for (const dateString of uniqueDateStrings) {
    uniqueDates.push(new Date(dateString))
  }

  return uniqueDates
}
export function isRoomOccupied(room) {
  const initialArray = []

  for (const reservation of room.Reservations) {
    if (!reservation.roomStatus !== 'checked-out') {
      for (const el of reservation.DatesIns[reservation.DatesIns.length - 1]
        .datesIn) {
        initialArray.push(new Date(el).toLocaleDateString('fr-FR'))
      }
    } else {
      return {}
    }
  }

  const uniqueDates = [...new Set(initialArray)]
  const today = new Date().toLocaleDateString('fr-FR')
  const yesterday = new Date(
    new Date().getTime() - 24 * 60 * 60 * 1000,
  ).toLocaleDateString('fr-FR')

  if (uniqueDates.includes(today) || uniqueDates.includes(yesterday)) {
    const occupiedReservation = room.Reservations.find((reservation) => {
      const datesInArray = reservation.DatesIns.flatMap((date) =>
        date.datesIn.map((el) => new Date(el).toLocaleDateString('fr-FR')),
      )

      return datesInArray.includes(today) || datesInArray.includes(yesterday)
    })

    return {
      reservation: occupiedReservation,
      room: room,
    }
  } else {
    return {}
  }
}

export function checkAvailability(room, datesToCheck) {
  const initialArray = []

  for (const reservation of room.Reservations) {
    for (const date of reservation.DatesIns) {
      for (const el of date.datesIn) {
        initialArray.push(new Date(el).toLocaleDateString('fr-FR'))
      }
    }
  }

  const uniqueDates = [...new Set(initialArray)]

  for (const dateToCheck of datesToCheck) {
    if (
      uniqueDates.includes(new Date(dateToCheck).toLocaleDateString('fr-FR'))
    ) {
      return null
    }
  }

  return {
    room: room,
  }
}

export function availableRooms(rooms) {
  let availableRooms = []

  for (const room in rooms) {
    availableRooms.push(checkAvailability(room))
  }

  return availableRooms.filter((value) => value !== null)
}

export const removeDuplicatesByName = (arr) => {
  const seenNames = {}
  const uniqueObjects = arr.filter(({ name }) => {
    const lowerCaseName = name.toLowerCase()
    if (!seenNames[lowerCaseName]) {
      seenNames[lowerCaseName] = true
      return true
    }
    return false
  })

  return uniqueObjects.map(({ name }) => ({ name: name.toLowerCase() }))
}
export function groupByClientName(objects) {
  const groupedObjects = {}

  objects.forEach((object) => {
    const clientName = object.clientName
    if (!groupedObjects[clientName]) {
      groupedObjects[clientName] = {
        clientName: clientName,
        invoices: [],
      }
    }
    groupedObjects[clientName].invoices.push(object)
  })

  return Object.values(groupedObjects)
}

export function removeDatesAfterToday(dates) {
  // Get the current date
  const today = new Date()

  // Filter out dates that are greater than or equal to today
  const filteredDates = dates.filter((dateString) => {
    const date = new Date(dateString)
    return date < today
  })

  return filteredDates
}
