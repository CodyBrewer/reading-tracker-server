describe('GET /status', () => {
  it('should return status 200 OK', async () => {
    const response = await cy.request('/status')
    expect(response.status).equal(200)
  })
  it('should have property of message with value of up', async () => {
    const response = await cy.request('/status')
    expect(response.body).to.have.property('message')
    expect(response.body.message).to.match(/up/)
  })
  it('should have property of current_time', async () => {
    const response = await cy.request('/status')
    expect(response.body).to.have.property('current_time')
  })
})