const request = require('supertest');
const express = require('express');
const statusRouter = require('../../api/routes/status');

const server = express();

describe('GET /status', () => {
  beforeAll(() => {
    server.use('/status', statusRouter);
  });

  it('should return 200 OK', async () => {
    const res = await request(server).get('/status');

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('up');
  });
});
