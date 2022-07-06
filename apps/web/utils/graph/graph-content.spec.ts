import { Graph } from '@modtree/types'
import { empty } from '@modtree/utils'
import { DegreeGraphs } from 'types'
import { getGraphContent } from '.'

/**
 * Custom sort comparator for DegreeGraphs.
 *
 * @param {DegreeGraphs} a
 * @param {DegreeGraphs} b
 * @returns {number}
 */
const cmp = (a: DegreeGraphs, b: DegreeGraphs): number => {
  return a.degree < b.degree ? -1 : 1
}

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
  expect(getGraphContent(graphs).sort()).toEqual(expected.sort())
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
  expect(getGraphContent(graphs).sort(cmp)).toEqual(expected.sort(cmp))
})
