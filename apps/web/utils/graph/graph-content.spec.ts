import { Graph } from '@modtree/types'
import { empty } from '@modtree/utils'
import { DegreeGraphs } from 'types'
import { getGraphContent } from '.'
import '@modtree/test-env/jest'

test('same degree title', () => {
  const graphs: Graph[] = [
    {
      ...empty.Graph,
      title: 'cs',
      degree: {
        id: '',
        title: 'my degree',
        modules: [],
      },
    },
    {
      ...empty.Graph,
      title: 'math',
      degree: {
        id: '',
        title: 'my degree',
        modules: [],
      },
    },
  ]

  const expected: DegreeGraphs[] = [
    { degree: 'my-degree', graphs: ['cs', 'math'] },
  ]
  expect(getGraphContent(graphs)).toIncludeSameMembers(expected)
})

test('different degree titles', () => {
  const graphs: Graph[] = [
    {
      ...empty.Graph,
      title: 'cs',
      degree: {
        id: '',
        title: 'your degree',
        modules: [],
      },
    },
    {
      ...empty.Graph,
      title: 'math',
      degree: {
        id: '',
        title: 'my degree',
        modules: [],
      },
    },
  ]

  const expected: DegreeGraphs[] = [
    { degree: 'my-degree', graphs: ['math'] },
    { degree: 'your-degree', graphs: ['cs'] },
  ]
  expect(getGraphContent(graphs)).toIncludeSameMembers(expected)
})
