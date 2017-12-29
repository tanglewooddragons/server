const chai = require('chai')

const { assert } = chai
const { scheduleAction } = require('../../src/services/scheduler')

module.exports = function () {
  describe('#scheduleAction', () => {
    it('Fails to schedule with missing data', () => {
      const options = {
        scheduledBy: 'mocha',
        type: 'task',
      }

      const resolve = async () => new Error('It should have not been called')

      return scheduleAction(options, resolve)
    })

    it('Schedules given task', () => {
      const options = {
        scheduledBy: 'mocha',
        type: 'task',
        scheduledFor: Date.now() + 100,
      }

      const resolve = async (data) => {
        assert.equal(data.scheduledBy, options.scheduledBy, 'It returns wrong data')
      }

      return scheduleAction(options, resolve)
    })
    it('Calls the resolve function on scheduled time', () => {
      const options = {
        scheduledBy: 'mocha',
        type: 'task',
        scheduledFor: Date.now() + 200,
      }

      const resolve = async () => {
        assert(Date.now() >= options.scheduledFor, 'It fired too quickly')
      }

      return scheduleAction(options, resolve)
    })
  })
}

