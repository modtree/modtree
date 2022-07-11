import { ModtreeApiResponse } from '@modtree/types'
import { empty } from '@modtree/utils'
import { getUniqueGraphTitle } from '.'

const graph: ModtreeApiResponse.Graph = {
  ...empty.Graph,
  title: 'my graph',
  degree: {
    id: '',
    title: 'my degree',
  },
}

test('it works', () => {
  expect(getUniqueGraphTitle(graph)).toEqual('my-degree/my-graph')
})
