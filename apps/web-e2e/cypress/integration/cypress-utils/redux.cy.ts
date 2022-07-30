import { z } from 'zod'

/** for local use only */
const uuid = z.string().uuid()

/**
 * checks that the entity passed in has an id property
 * that is a valid UUID
 */
const checkId = (entity: any) => {
  const id = uuid.safeParse(entity.id)
  expect(id).to.have.nested.include({ success: true })
}

/**
 * check that the entity passed in has all the properties listed
 */
const checkProps = (entity: any, props: string[]) => {
  props.forEach((p) => expect(entity).to.have.property(p))
}

describe('redux', () => {
  before(() => cy.login())

  it('graph state', () => {
    cy.reduxGraph().then((graph) => {
      checkId(graph)
      checkProps(graph, ['flowNodes', 'flowEdges'])
    })
  })

  it('user state', () => {
    cy.reduxUser().then((user) => {
      checkId(user)
      checkProps(user, ['email', 'username', 'mainGraph', 'mainDegree'])
    })
  })

  it('degree state', () => {
    cy.reduxDegree().then((degree) => {
      checkId(degree)
      checkProps(degree, ['title', 'modules'])
    })
  })
})
