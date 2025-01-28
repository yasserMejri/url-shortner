const crypto = require('crypto');
const urlModel = require('./model');

/**
 * Generates a random short key.
 *
 * @returns {string} A random short key in hexadecimal format.
 */
function generateShortKey() {
  return crypto.randomBytes(4).toString('hex');
}

/**
 * Checks if a given string is a valid URL.
 *
 * @param {string} string - The string to validate.
 * @returns {boolean} True if the string is a valid URL, false otherwise.
 */
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Handles the request to generate or retrieve a short URL.
 *
 * @param {string} req.body.url - The full URL to shorten.
 * @returns {Promise<{shortKey, error}>} A promise that resolves when the response is sent.
 */
const getShortUrl = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'fullUrl is required' });
  }

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    // Search for existing record
    let urlRecord = await urlModel.findOne({ fullUrl: url });

    if (urlRecord) {
      // Return existing shortKey if found
      return res.status(200).json({ shortKey: urlRecord.shortKey });
    } else {
      // Create new record with unique shortKey
      const shortKey = generateShortKey();
      urlRecord = new urlModel({ fullUrl: url, shortKey });
      await urlRecord.save();

      return res.status(201).json({ shortKey });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Handles the request to redirect to the full URL based on the short key.
 *
 * @param {string} req.params.shortKey - The short key to look up.
 */
const redirectToFullUrl = async (req, res) => {
  try {
    const { shortKey } = req.params;
    const url = await urlModel.findOne({ shortKey });

    if (url) {
      return res.redirect(url.fullUrl);
    } else {
      return res.status(404).send('URL not found');
    }
  } catch (error) {
    return res.status(500).send('Server error');
  }
};

module.exports = {
  getShortUrl,
  redirectToFullUrl,
};
