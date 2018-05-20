import ax from './ax'
// let qs = require('qs')

export async function getRank(params) {
  return await ax({
    url: '/data/v1/team_ranking/0',
    method: 'get',
    params: { ...params }
  })
}