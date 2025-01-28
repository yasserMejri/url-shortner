const sinon = require('sinon');
const { getShortUrl, redirectToFullUrl } = require('./controller');
const urlModel = require('./model');

describe('URL Shortener Controller', () => {
  let req, res, urlModelStub;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
      redirect: sinon.stub(),
      send: sinon.stub(),
    };
    urlModelStub = sinon.stub(urlModel, 'findOne');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getShortUrl', () => {
    it('should return 400 if URL is invalid', async () => {
      req.body.url = 'invalid-url';
      await getShortUrl(req, res);
      expect(res.status.calledWith(400)).toBe(true);
      expect(res.json.calledWith({ error: 'Invalid URL' })).toBe(true);
    });

    it('should return 400 if URL is missing', async () => {
      await getShortUrl(req, res);
      expect(res.status.calledWith(400)).toBe(true);
      expect(res.json.calledWith({ error: 'fullUrl is required' })).toBe(true);
    });

    it('should return existing shortKey if URL is found in the database', async () => {
      req.body.url = 'http://example.com';
      urlModelStub.resolves({ shortKey: 'abc123' });
      await getShortUrl(req, res);
      expect(res.status.calledWith(200)).toBe(true);
      expect(res.json.calledWith({ shortKey: 'abc123' })).toBe(true);
    });

    it('should create a new short URL if URL is not found in the database', async () => {
      req.body.url = 'http://example.com';
      urlModelStub.resolves(null);
      const saveStub = sinon.stub(urlModel.prototype, 'save').resolves();
      await getShortUrl(req, res);
      expect(res.status.calledWith(201)).toBe(true);
      expect(res.json.calledWithMatch({ shortKey: sinon.match.string })).toBe(
        true
      );
      saveStub.restore();
    });

    it('should return 500 if there is an internal server error', async () => {
      req.body.url = 'http://example.com';
      urlModelStub.rejects(new Error('Internal Server Error'));
      await getShortUrl(req, res);
      expect(res.status.calledWith(500)).toBe(true);
      expect(res.json.calledWith({ error: 'Internal Server Error' })).toBe(
        true
      );
    });
  });

  describe('redirectToFullUrl', () => {
    it('should redirect to the full URL if shortKey is found', async () => {
      req.params.shortKey = 'abc123';
      urlModelStub.resolves({ fullUrl: 'http://example.com' });
      await redirectToFullUrl(req, res);
      expect(res.redirect.calledWith('http://example.com')).toBe(true);
    });

    it('should return 404 if shortKey is not found', async () => {
      req.params.shortKey = 'abc123';
      urlModelStub.resolves(null);
      await redirectToFullUrl(req, res);
      expect(res.status.calledWith(404)).toBe(true);
      expect(res.send.calledWith('URL not found')).toBe(true);
    });

    it('should return 500 if there is an internal server error', async () => {
      req.params.shortKey = 'abc123';
      urlModelStub.rejects(new Error('Internal Server Error'));
      await redirectToFullUrl(req, res);
      expect(res.status.calledWith(500)).toBe(true);
      expect(res.send.calledWith('Server error')).toBe(true);
    });
  });
});
