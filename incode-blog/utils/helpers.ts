const maxLength = 120
export const excerpt = (str: string) =>
  str.length > maxLength ? str.substr(0, maxLength) + '...' : str
