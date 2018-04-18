/*
  @TODO
  Decide what data should be extracted as consts
  or saved in the db
  Think about their usage and translations:
  - Will they be displayed to end-user?
  - Will they be used somewhere else than here?
*/

const locations = [
  {
    name: 'Githan Volcano',
    goodTerrain: 'Upper Atmosphere',
    badTerrain: 'Rainclouds',
    ingredient: 'Gunpowder',
    stat: 'str',
    hierogliph: 'Brazier',
  },
  {
    name: 'Phiaron',
    goodTerrain: 'Rainclouds',
    badTerrain: 'Clear Sky',
    ingredient: 'Spring Water',
    stat: 'int',
    hierogliph: 'Papyrus Stem',
  },
  {
    name: 'Diamond Mountains',
    goodTerrain: 'Clouds',
    badTerrain: 'Ground',
    ingredient: 'Eastern Wind',
    stat: 'agl',
    hierogliph: 'Flowering Reeds',
  },
  {
    name: 'Fields of Summer',
    goodTerrain: 'Ground',
    badTerrain: 'Clouds',
    ingredient: 'Cherry Petals',
    stat: 'con',
    hierogliph: 'Boundary Stone',
  },
  {
    name: 'Sword Coast',
    goodTerrain: 'Clear Sky',
    badTerrain: 'Fog',
    ingredient: 'Sword Pearls',
    stat: 'wlp',
    hierogliph: 'Twisted Flax',
  },
  {
    name: 'Eastern Desert',
    goodTerrain: 'Fog',
    badTerrain: 'Upper Atmosphere',
    ingredient: 'Poison Ivy',
    stat: 'lck',
    hierogliph: 'Knot',
  },
]

module.exports = locations
