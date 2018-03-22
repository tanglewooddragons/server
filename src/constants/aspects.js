const aspects = {
  earth: {
    tier: 0,
    modifier: [1, 0, 0, 0, 0, 0],
  },
  water: {
    tier: 0,
    modifier: [0, 1, 0, 0, 0, 0],
  },
  fire: {
    tier: 0,
    modifier: [0, 0, 1, 0, 0, 0],
  },
  air: {
    tier: 0,
    modifier: [0, 0, 0, 1, 0, 0],
  },
  order: {
    tier: 0,
    modifier: [0, 0, 0, 0, 1, 0],
  },
  chaos: {
    tier: 0,
    modifier: [0, 0, 0, 0, 0, 1],
  },
  clockwork: {
    tier: 6,
    parents: ['fire', 'order'],
  },
}

const isBasicAspect = (name) => {
  const aspect = aspects[name]
  if (!aspect) return false
  if (aspect.tier !== 0) return false
  return true
}

module.exports = {
  aspects,
  isBasicAspect,
}
