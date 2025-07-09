export const convertToLink = (str: string) => {
  // Regex pattern to check if string is a proper URL
  var pattern = new RegExp('^(http|https)://', 'i');

  // If the string is already a URL, return it as is
  if (pattern.test(str)) {
    return str;
  }

  return 'https://' + str;
};
