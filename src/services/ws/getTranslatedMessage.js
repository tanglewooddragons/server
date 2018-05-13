const en = require('constants/locales/en')
const pl = require('constants/locales/pl')

const locales = {
  en,
  pl,
}

const getTranslatedMessage = locale => id => locales[locale][id]

module.exports = getTranslatedMessage
