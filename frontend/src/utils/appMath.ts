export const numToHumanTime = (num: number) => {
  if (num === 0) return num

  const tmpNum = Math.floor(num / 10) / 100
  if (tmpNum.toString().indexOf('.') === -1) {
    return `${tmpNum}h`
  }

  const tmpSplit = tmpNum.toString().split('.')
  const tmpMin = tmpSplit[1].padEnd(2, '0')
  if (parseInt(tmpMin) === 0) {
    return tmpNum
  }

  const hour = parseInt(tmpSplit[0])
  const min = Math.floor((parseInt(tmpMin) * 60) / 100)

  return hour === 0 ? `${min}m` : `${hour}h ${min}m`
}
