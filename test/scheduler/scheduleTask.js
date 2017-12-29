const chai = require('chai')

const { assert } = chai
const { scheduleTask } = require('../../src/services/scheduler')

module.exports = function () {
  describe('#scheduleTask', () => {
    it('Fails to schedule with missing data', () => {
      const options = {
        scheduledBy: 'mocha',
      }

      const resolve = async () => new Error('It should have not been called')

      return scheduleTask(options, resolve)
    })

    it('Schedules given task', () => {
      const options = {
        scheduledBy: 'mocha',
        scheduledFor: Date.now() + 100,
      }

      const resolve = async (data) => {
        assert.equal(data.scheduledBy, options.scheduledBy, 'It returns wrong data')
      }

      return scheduleTask(options, resolve)
    })
    it('Calls the resolve function on scheduled time', () => {
      const options = {
        scheduledBy: 'mocha',
        scheduledFor: Date.now() + 200,
      }

      const resolve = async () => {
        assert(Date.now() >= options.scheduledFor, 'It fired too quickly')
      }

      return scheduleTask(options, resolve)
    })
  })
}

