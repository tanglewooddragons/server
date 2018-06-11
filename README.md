# Tanglewood Dragons API

<!-- Badges -->
[![CircleCI](https://circleci.com/gh/tanglewooddragons/server.svg?style=shield)](https://circleci.com/gh/tanglewooddragons/server)
<!-- /Badges -->

# Table of Contents

  * [Intro](#intro)
  * [Commands](#commands)
  * [API Overview](#api-overview)
    * [HTTP routes](#http-routes)
      * [Auth](#auth)
      * [User](#user)
      * [Dragon](#dragon)
      * [Message](#message)
    * [WebSocket Events](#websocket-events)
    * [Errors](#errors)

------

# Intro

This repository contains files for the Tanglewood Dragons back-end server.
It is still a WIP and not ready for production yet.

# Commands

  - `start` - Starts the server in development mode
  - `start:production` - Starts the server in production mode
  - `db:start` - Starts docker db containers and runs `db:seed` command
  - `db:seed` - Seeds running db with default entries (items, locations, etc.)
  - `db:stop` - Stops currently running db process
  - `db:clean` - Stops and removes db from docker
  - `test` - Runs all tests
  - `test:debug` - Runs all tests with debug env set (All server logs are visible)
  - `test:watch` - Re-runs tests automatically every time a file changes
  - `lint` - Checks `src` directory for linter errors and warnings
  - `profile:setup` - Starts the server in production mode with flag for collecting profiling data
  - `profile:run` - Runs the profiling script (Requires a running server with `profile:setup` and Apache Bench installed)

# API Overview

This paragraph contains brief overview of all API routes. For a more in-depth documentation please refer to the [server-docs](https://github.com/tanglewooddragons/server-docs).

All routes are prefixed with `/api`

Routes marked with :key: require access token obtained on login.

## HTTP Routes

The body of a request made to the API must be a valid JSON, and the request must use proper header (`'content-type': 'application/json'`)

### Auth
------

  - [/register](/register) - __[POST]__ Register a new account
  - [/login](/login) - __[POST]__ Login to a existing account
  - [/refreshToken](/refreshToken) - :key: __[POST]__ Refresh access token
  - [/logout](/logout) - :key: __[POST]__ Blacklist passed refresh token (log out of current device)
  - [/logoutAll](/logoutAll) - :key: __[GET]__ Blacklist all of user tokens (log out of every device)
  - [/acceptToS](/acceptToS) - :key: __[GET]__ Marks terms of service as accepted by current user

------

### User
------

  - [/user](/user) - :key: __[GET]__ Get current user profile
  - [/user/:id](/user/:id) - :key: __[GET]__ Get profile of user with given id
  - [/user](/user) - :key: __[POST]__ Update current user profile
  - [/user](/user) - :key: __[DELETE]__ Delete current user profile (__Note:__ :wrench: This route if definietly going to be reworked with need to provide password at least)

------

### Dragon

To perform operations on dragons other than getting their data, current user must be owner of the dragon.

------

  - [/dragon/:id](/dragon/:id) - :key: __[GET]__ Get dragon with given id
  - [/dragon/:id](/dragon/:id) - :key: __[POST]__ Update dragon with given id
  - [/dragon/:id](/dragon/:id) - :key: __[DELETE]__ Delete dragon with given id (__Note:__ :wrench: This route if definietly going to be reworked with need to provide password at least)
  - [/dragon/create](/dragon/create) - :key: __[POST]__ Create a new dragon of basic aspect (works only if you have 0 dragons)
  - [/dragon/feed/:id](/dragon/feed/:id) - :key: __[POST]__ Feeds dragon with provided food type
  - [/dragon/task](/dragon/task) - :key: __[POST]__ Sends dragon on task
  - [/dragon/statuses](/dragon/statuses) - :key: __[GET]__ Returns statuses of all user dragons

------

### Message
------

  - [/message/all](/message/all) - :key: __[GET]__ Get all user messages
  - [/message/received](/message/received) - :key: __[GET]__ Get all received messages
  - [/message/sent](/message/sent) - :key: __[GET]__ Get all sent messages
  - [/message](/message) - :key: __[POST]__ Send a new message

------

## Websocket Events

All Websocket request and responses should follow this format:
```json
{
  "type": "CONSTANT_EVENT_TYPE",
  "payload": {
    "some-key": "some-data"
  }
}
```
As WebSockets only support sending primitive values this should be `JSON.stringify`ied.

Additionally client must provide access token in `payload` as `token`, otherwise request will be rejected

```json
{
  "type": "GET_MESSAGES",
  "payload": {
    "token": "<access_token>",
    "channel": "general"
  }
}
```

### Chat
------

  - [GET_MESSAGES](GET_MESSAGES) - To get messages from a specifiec channel:

```json
{
  "type": "GET_MESSAGES",
  "payload": {
    "token": "<access_token>",
    "channel": "general"
  }
}
```

Where `channel` is specified chat channel

Currently availible chat channels: `general`, `trade`

If the request was successful server will respond with:
```json
{
  "type": "MESSAGES",
  "payload": {
    "messages": []
  }
}
```

  - [SEND_MESSAGE](SEND_MESSAGE) - To send a new message to chat:

```json
{
  "type": "SEND_MESSAGE",
  "payload": {
    "token": "<access_token>",
    "channel": "general",
    "text": "Content of the message"
  }
}
```

On success the server will broadcast new message to every connected socket:

```json
{
  "type": "NEW_MESSAGE",
  "payload": {
    "message": {}
  }
}
```

:construction: This response may be removed in favor of just broadcasting a new `MESSAGES` batch for the sake of simplicity

------

### Notification

Notification are sent only from the server and do not expect any kind of response or anything.

Notifications look like this:
```json
{
  "type": "NOTIFICATION",
  "payload": {
    "title": "Short title",
    "text": "More detailed description"
  }
}
```

## Errors

Errors sent out by the API are JSON and follow this format:
```json
{
  "error": true,
  "message": {
    "text": "Text message suitable for displaying to user",
    "status": 400
  }
}
```

------

Validation errors (status = 422) have a slighly different structure:
```json
{
  "error": true,
  "message": {
    "messages": [],
    "fields": []
  }
}
```
`messages` contains all error messages given by the validator

`fields` lists all fields that failed validation

Their indexes should be matching so messages[0] should be the error for fields[0].

:construction: Validation errors return messages only in English for now.

------

Websocket errors have special response types and they provide only the error message:

```json
{
  "type": "ERROR",
  "payload": {
    "error": "Big scary error message in users browser language (or English if unknown)"
  }
}
```

  - [ERROR](ERROR) - Is a generic error type, like missing data in request
  - [TYPE_ERROR](TYPE_ERROR) - Requested type is not handled by the server (propably misspell) [__NOTE:__ This should not happen in production as the types should be constant in the app and matching the server-side ones]
  - [AUTH_ERROR](AUTH_ERROR) - Token is missing or is expired
