// jest.useFakeTimers()
const schedule = require('node-schedule')

const {
  scheduleAction,
  registerHandler,
} = require('services/scheduler')

const sleep = async ms => new Promise((resolve) => {
  setTimeout(resolve, ms)
})

describe('scheduleAction', () => {
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

    const resolve = async (job) => {
      expect(job.scheduledBy).toBe(options.scheduledBy)
    }

    registerHandler('schedule-test', resolve)

    await scheduleAction(options)
    const registeredJobAmount = Object.keys(schedule.scheduledJobs).length
    expect(registeredJobAmount).toBe(1)
    // jest.runOnlyPendingTimers()
    await sleep(500)
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

    expect(resolve).not.toBeCalled()
    // jest.runOnlyPendingTimers()
    await sleep(500)
    expect(resolve).toBeCalled()
    expect(resolve).toHaveBeenCalledTimes(1)
  })
})
