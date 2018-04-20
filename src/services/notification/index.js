/*
  Notification service

  This service uses the ws service to send notifications to users.
  It provides simple interface used only from the api to fire
  notifications.

  Notifications should be short update messages,
  like a dragon returning from a task.

  They should not be used to send crucial information as they are
  not saved anywhere and offline users won't see them.
*/

const send = require('./actions/send')

module.exports = {
  send,
}
