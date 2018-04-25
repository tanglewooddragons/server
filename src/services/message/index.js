const Router = require('koa-router')

const getMessages = require('./routes/getMessages')
const getReceivedMessages = require('./routes/getReceivedMessages.js')
const getSentMessages = require('./routes/getSentMessages')
const sendMessage = require('./routes/sendMessage')

const router = new Router()

router.get('/message/all', getMessages)
router.get('/message/received', getReceivedMessages)
router.get('/message/sent', getSentMessages)
router.post('/message', sendMessage)

module.exports = router
