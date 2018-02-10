const chai = require('chai')
const schedule = require('node-schedule')

const { assert } = chai
const {
  scheduleAction,
  registerHandler,
} = require('../../src/services/scheduler')

const sleep = time => new Promise((resolve) => {
  setTimeout(resolve, time)
})

module.exports = function () {
  describe('scheduleAction', () => {
    it('Fails to schedule with missing data', async () => {
      const options = {
        scheduledBy: 'mocha',
        type: 'test',
      }

      const resolve = async () => {
        throw new Error('It should have not been called')
      }

      registerHandler('test', resolve)

      await scheduleAction(options)

      const registeredJobAmount = Object.keys(schedule.scheduledJobs).length
      assert.equal(registeredJobAmount, 0, 'It registered the job')
    })

    it('Schedules given task', async () => {
      const options = {
        scheduledBy: 'mocha',
        type: 'test',
        scheduledFor: Date.now() + 1000,
      }

      const resolve = async (data) => {
        assert.equal(data.scheduledBy, options.scheduledBy, 'It returns wrong data')
      }

      registerHandler('test', resolve)

      await scheduleAction(options)

      const registeredJobAmount = Object.keys(schedule.scheduledJobs).length
      assert.equal(registeredJobAmount, 1, 'It didnt register the job')

      await sleep(1000)
    })

    it('Calls the resolve function on scheduled time', async () => {
      const options = {
        scheduledBy: 'mocha',
        type: 'test',
        scheduledFor: Date.now() + 1000,
      }

      const resolve = async () => {
        assert(Date.now() >= options.scheduledFor, 'It fired too quickly')
      }

      registerHandler('test', resolve)

      await scheduleAction(options)
      await sleep(1000)
    })
  })
}

