import dayjs from 'dayjs'
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)
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
// export const getDuplicates = function (array1, array2) {
//   const duplicates = []
//   const seen = new Set()
//   for (const { name: element } of array1) {
//     if (seen.has(element)) continue
//     seen.add(element)
//     const elementDuplicates = array2.filter(
//       ({ itemName }) => itemName === element,
//     )
//     if (elementDuplicates.length > 0) {
//       duplicates.push(...elementDuplicates)
//     }
//   }
//   console.log(duplicates)
//   return duplicates
// }

export const getDuplicates = function (array1, array2) {
  const results = []
  const seen = new Set()
  for (const { name: element } of array1) {
    if (seen.has(element)) continue
    seen.add(element)
    const elementDuplicates = array2.filter(
      ({ itemName }) => itemName === element,
    )
    if (elementDuplicates.length > 0) {
      results.push({ name: element, duplicates: elementDuplicates })
    }
  }
  return results
}
