const aspects = {
  earth: {
    tier: 0,
  },
  water: {
    tier: 0,
  },
  fire: {
    tier: 0,
  },
  air: {
    tier: 0,
  },
  order: {
    tier: 0,
  },
  chaos: {
    tier: 0,
  },
}

const getBasicAspect = () => {
  const basicAspects = Object
    .keys(aspects)
    .reduce((arr, aspect) => {
      if (aspect.tier === 0) arr.push(aspect)
      return arr
    }, [])

  const idx = Math.floor(Math.random() * basicAspects.length)
  return basicAspects[idx]
}

module.exports = {
  aspects,
  getBasicAspect,
}
