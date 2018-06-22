const schedule = require('node-schedule')

const {
  scheduleAction,
  registerHandler,
} = require('services/scheduler')

const sleep = async ms => new Promise((resolve) => {
  setTimeout(resolve, ms)
})

describe('scheduleAction', () => {
  beforeEach(() => {
    Object
      .values(schedule.scheduledJobs)
      .forEach(job => job.cancel())
  })

  test('Fails to schedule with missing data', async () => {
    const options = {
      scheduledBy: 'jest',
      type: 'test',
    }

    const resolve = async () => {
      throw new Error('It should have not been called')
    }

    registerHandler('test', resolve)

    await scheduleAction(options)

    const registeredJobAmount = Object.keys(schedule.scheduledJobs).length
    expect(registeredJobAmount).toBe(0)
  })

  test('Schedules given task', async () => {
    const options = {
      scheduledBy: 'jest',
      type: 'schedule-test',
      scheduledFor: Date.now() + 500,
    }

    const resolve = () => {}

    registerHandler('schedule-test', resolve)

    await scheduleAction(options)
    const registeredJobAmount = Object.keys(schedule.scheduledJobs).length
    expect(registeredJobAmount).toBe(1)
  })

  test('Calls the resolve function on scheduled time', async () => {
    const options = {
      scheduledBy: 'jest',
      type: 'call-test',
      scheduledFor: Date.now() + 500,
    }

    const resolve = jest.fn()

    registerHandler('call-test', resolve)

    await scheduleAction(options)
    await sleep(600)
    expect(resolve).toBeCalled()
  })
})
