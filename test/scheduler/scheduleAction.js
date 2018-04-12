const schedule = require('node-schedule')

const {
  scheduleAction,
  registerHandler,
} = require('../../src/services/scheduler')

module.exports = function () {
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

    test('Schedules given task', (done) => {
      const options = {
        scheduledBy: 'jest',
        type: 'test',
        scheduledFor: Date.now() + 150,
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
        })
    })

    test('Calls the resolve function on scheduled time', (done) => {
      const options = {
        scheduledBy: 'jest',
        type: 'test',
        scheduledFor: Date.now() + 150,
      }

      const resolve = async () => {
        expect(options.scheduledFor).toBeLessThanOrEqual(Date.now())
        done()
      }

      registerHandler('test', resolve)
      scheduleAction(options)
    })
  })
}

