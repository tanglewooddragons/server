const { aspects } = require('constants/aspects')

function getAllModifiers(aspect) {
  const entry = aspects[aspect]
  if (entry.modifier) {
    return entry.modifier
  }
  return entry.parents.map(asp => getAllModifiers(asp))
}

// Transform nested arrays to tiered form
function transform(stats, level = 1, result = {}) {
  stats.forEach((sub) => {
    if (Array.isArray(sub)) {
      transform(sub, level + 1, result)
    } else {
      if (!result[level]) result[level] = []
      result[level].push(sub)
    }
  })
  return result
}

function calculateStats(tiers) {
  let finalStats = [0, 0, 0, 0, 0, 0]

  Object
    .keys(tiers)
    .forEach((tier) => {
      const summedStats = tiers[tier]
        .reduce((stats, stat, index) => {
          stats[index % 6] += stat
          return stats
        }, [0, 0, 0, 0, 0, 0])

      finalStats = finalStats.map((stat, index) => {
        const newStat = stat + (+(summedStats[index] / Math.sqrt(tier)).toFixed(2))
        return newStat
      })
    })

  return finalStats
}

const getModifier = type => calculateStats(transform(getAllModifiers(type)))

module.exports = getModifier
