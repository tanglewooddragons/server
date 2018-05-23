const { aspects } = require('constants/aspects')

const baseAspects = Object
  .entries(aspects)
  // eslint-disable-next-line
  .filter(([key, value]) => value.modifier)
  .map(([key]) => key)

const statDict = {
  earth: 'con',
  water: 'int',
  fire: 'str',
  air: 'agl',
  order: 'wlp',
  chaos: 'lck',
}

function mapAspectsNames(aspect, result = {}, depth = 1) {
  const entry = aspects[aspect]

  if (baseAspects.includes(aspect)) {
    if (!result[depth]) result[depth] = []
    result[depth].push(aspect)
  }

  if (entry.parents) {
    entry
      .parents
      .forEach(parent =>
        mapAspectsNames(parent, result, depth + 1)
      )
  }

  return result
}

function calculateStats(aspectsTree) {
  const current = {
    earth: 0,
    water: 0,
    fire: 0,
    air: 0,
    order: 0,
    chaos: 0,
  }

  Object
    .entries(aspectsTree)
    .forEach(([tier, tierAspects]) => {
      const instances = tierAspects.reduce((acc, asp) => {
        if (!acc[asp]) acc[asp] = 1
        else acc[asp] += 1
        return acc
      }, {})

      Object
        .keys(instances)
        .forEach((aspect) => {
          const rowTotal = instances[aspect] / Math.sqrt(tier)
          current[aspect] += rowTotal
        })
    })

  const final = Object
    .keys(current)
    .reduce((acc, aspect) => {
      const stat = statDict[aspect]
      acc[stat] = Number(current[aspect].toFixed(2))
      return acc
    }, {})

  return final
}

module.exports = aspect => calculateStats(mapAspectsNames(aspect))
