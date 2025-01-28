const request = require('supertest');
const mongoose = require('mongoose');
const urlModel = require('./server/url-shortner/model');

jest.mock('mongoose');
jest.mock('./server/url-shortner/model', () => {
  const mockUrlModel = function () {};
  mockUrlModel.findOne = jest.fn();
  mockUrlModel.prototype.save = jest.fn();
  return mockUrlModel;
});

const app = require('./index');

describe('URL Shortener API', () => {
  beforeAll(() => {
    mongoose.connect.mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    jest.clearAllMocks();
    app.server.close();
  });

  describe('POST /api/getShortUrl', () => {
    it('should return 400 if URL is invalid', async () => {
      const response = await request(app)
        .post('/api/getShortUrl')
        .send({ url: 'invalid-url' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid URL');
    });

    it('should return 400 if URL is missing', async () => {
      const response = await request(app).post('/api/getShortUrl').send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('fullUrl is required');
    });

    it('should return existing shortKey if URL is found in the database', async () => {
      urlModel.findOne.mockResolvedValue({ shortKey: 'abc123' });

      const response = await request(app)
        .post('/api/getShortUrl')
        .send({ url: 'http://example.com' });

      expect(response.status).toBe(200);
      expect(response.body.shortKey).toBe('abc123');
    });

    it('should create a new short URL if URL is not found in the database', async () => {
      urlModel.findOne.mockResolvedValue(null);
      urlModel.prototype.save.mockResolvedValue();

      const response = await request(app)
        .post('/api/getShortUrl')
        .send({ url: 'http://example.com' });

      expect(response.status).toBe(201);
      expect(response.body.shortKey).toBeDefined();
    });

    it('should return 500 if there is an internal server error', async () => {
      urlModel.findOne.mockRejectedValue(new Error('Internal Server Error'));

      const response = await request(app)
        .post('/api/getShortUrl')
        .send({ url: 'http://example.com' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal Server Error');
    });
  });

  describe('GET /:shortKey', () => {
    it('should redirect to the full URL if shortKey is found', async () => {
      urlModel.findOne.mockResolvedValue({ fullUrl: 'http://example.com' });

      const response = await request(app).get('/abc123');

      expect(response.status).toBe(302);
      expect(response.header.location).toBe('http://example.com');
    });

    it('should return 404 if shortKey is not found', async () => {
      urlModel.findOne.mockResolvedValue(null);

      const response = await request(app).get('/abc123');

      expect(response.status).toBe(404);
      expect(response.text).toBe('URL not found');
    });

    it('should return 500 if there is an internal server error', async () => {
      urlModel.findOne.mockRejectedValue(new Error('Internal Server Error'));

      const response = await request(app).get('/abc123');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Server error');
    });
  });
});
