const schedule = require('node-schedule')

const {
  scheduleAction,
  registerHandler,
} = require('../../src/services/scheduler')

module.exports = function () {
  describe('scheduleAction', () => {
    beforeAll(() => {
      // Cancel all running jobs
      const jobs = Object.keys(schedule.scheduledJobs)
      jobs.forEach(id => schedule.cancelJob(id))
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

    test('Schedules given task', (done) => {
      const options = {
        scheduledBy: 'jest',
        type: 'test',
        scheduledFor: Date.now() + 1000,
      }

      const resolve = async (data) => {
        expect(data.scheduledBy).toBe(options.scheduledBy)
        done()
      }

      registerHandler('test', resolve)

      scheduleAction(options)
        .then(() => {
          const registeredJobAmount = Object.keys(schedule.scheduledJobs).length
          expect(registeredJobAmount).toBe(1)
          jest.runOnlyPendingTimers()
        })
    })

    test('Calls the resolve function on scheduled time', (done) => {
      const options = {
        scheduledBy: 'jest',
        type: 'test',
        scheduledFor: Date.now() + 1000,
      }

      const resolve = jest.fn()

      registerHandler('test', resolve)
      scheduleAction(options)
        .then(() => {
          expect(resolve).not.toBeCalled()
          jest.advanceTimersByTime(1000)
          expect(resolve).toBeCalled()
          expect(resolve).toHaveBeenCalledTimes(1)
          done()
        })
    })
  })
}

