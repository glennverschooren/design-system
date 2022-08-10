import { app } from '../../support/app'

describe('Pagination', () => {
  const page = app.getPaginationPage()

  it('should verify the page setup', () => {
    page.open()
    cy.getComponent(page.pagination).balPaginationFindPages().should('have.length', '8')
    cy.getComponent(page.pagination).balPaginationFindPages().first().contains('1')
    cy.getComponent(page.pagination).balPaginationFindPages().last().contains('20')
    cy.getComponent(page.pagination).balPaginationFindCurrentPage().contains('2')
  })

  it('should go to the next page and back again', () => {
    page.open()
    cy.getComponent(page.pagination).balPaginationFindNextButton().click()
    cy.getComponent(page.pagination).balPaginationFindCurrentPage().contains('3')
    cy.getComponent(page.pagination).balPaginationFindPreviousButton().click()
    cy.getComponent(page.pagination).balPaginationFindCurrentPage().contains('2')
  })

  it('should go to the last page and verify the page buttons', () => {
    page.open()
    cy.getComponent(page.pagination).balPaginationFindPages().last().click()
    cy.getComponent(page.pagination).balPaginationFindPages().first().contains('1')
    cy.getComponent(page.pagination).balPaginationFindPages().eq(1).contains('14')
    cy.getComponent(page.pagination).balPaginationFindPages().last().contains('20')
  })
})