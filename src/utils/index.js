import { generateColors } from './color'
import { writeNewStyle } from './writeNewStyle'
import {getStyleTemplate} from './getStyleTemplate'

const buildQuery = (obj) => {
  const querys = []
  for(const key in obj) {
    obj[key] &&
      querys.push(`${key}=${obj[key]}`)
  }
  return querys.join('&')
}

export {
  generateColors,
  writeNewStyle,
  getStyleTemplate,
  buildQuery
}
