const shortId = require('shortid')

const log = require('./log')

const sanitizeHeaders = (headers) => {
  // Copy headers, we don't want
  // to modify the real ones
  const cleanHeaders = Object.assign(
    {},
    headers,
  )

  const headersToRedact = [
    'authorization',
    'Authorization',
  ]

  const redactKey = '** removed **'

  // Override token headers
  headersToRedact.forEach((header) => {
    if (header in cleanHeaders) {
      cleanHeaders[header] = redactKey
    }
  })

  return cleanHeaders
}

const serializeReq = ctx => ({
  url: ctx.url,
  method: ctx.method,
  headers: sanitizeHeaders(ctx.request.headers),
  ip: ctx.ip,
  protocol: ctx.protocol,
  originalUrl: ctx.originalUrl,
  query: ctx.query,
})

const serializeRes = ctx => ({
  statusCode: ctx.status,
  headers: sanitizeHeaders(ctx.response.headers),
})

const getUserId = ctx => (
  ctx.state.user
    ? ctx.state.user.id
    : 'guest'
)

const logger = async (ctx, next) => {
  const uid = shortId.generate()

  try {
    log.info({
      action: 'request',
      status: 'pending',
      data: {
        userId: getUserId(ctx),
        uid,
        ...serializeReq(ctx),
      },
    })

    await next()

    log.info({
      action: 'request',
      status: 'success',
      data: {
        userId: getUserId(ctx),
        uid,
        ...serializeReq(ctx),
        ...serializeRes(ctx),
      },
    })
  } catch (err) {
    /*
    Error example:
    ctx.throw(400, {
      message: {
        status: 400,
        text: 'Invalid E-mail',
      },
    })

    Validation error (422) have a `details` key
    instead of the usual text `key` containing
    an array of all fields that failed validation
    */

    const status = err.message.status
      ? err.message.status
      : err.status

    ctx.status = status

    log.error({
      action: 'request',
      status: 'failed',
      data: {
        userId: getUserId(ctx),
        uid,
        ...serializeReq(ctx),
        ...serializeRes(ctx),
      },
    })

    // All errors should be JSON
    ctx.response.type = 'application/json'

    if (!err.message) {
      log.warn('Error without message', err)

      ctx.body = {
        error: true,
        message: {
          status,
          text: err.message,
        },
      }

      return
    }

    // If error is written as:
    // ctx.throw(403, 'Forbidden')
    if (typeof err.message === 'string') {
      ctx.body = {
        error: true,
        message: {
          status,
          text: err.message,
        },
      }

      return
    }

    // Handle special error cases

    // Auth error
    if (status === 401) {
      ctx.body = {
        error: true,
        message: {
          status,
          text: ctx.i18n.__('auth.error.authorization') || 'Authorization error',
        },
      }
    }

    // Validation error
    if (status === 422) {
      const messages = err.message.details.map(field => field.message)
      const fields = err.message.details.map(field => field.path.join('.'))

      ctx.body = {
        error: true,
        message: {
          status,
          messages,
          fields,
        },
      }

      return
    }

    // Internal server error
    // Do not leak internal messages to user
    if (status === 500) {
      log.warn('Internal server error', err)

      ctx.body = {
        error: true,
        message: {
          status: 500,
          text: 'Internal server error',
        },
      }

      return
    }

    // Generic error case
    ctx.body = {
      error: true,
      message: {
        status,
        text: err.message,
      },
    }
  }
}

module.exports = logger
