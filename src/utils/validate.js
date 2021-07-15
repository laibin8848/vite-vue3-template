/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
   * @param {string} str
   * @returns {Boolean}
   */
export function validUsername(str) {
  // eslint-disable-next-line camelcase
  const valid_map = ['admin', 'editor'];
  return valid_map.indexOf(str.trim()) >= 0;
}

export function isPhone (value) {
  return /^1[3456789]\d{9}$/.test(value)
}
