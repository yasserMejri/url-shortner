import React, { useState, useTransition } from "react";
import { getShortnedUrl } from "./service";
import "./App.css";

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const App = () => {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, startProcessing] = useTransition();

  const shortenUrl = async () => {
    if (isValidUrl(url) === false) {
      setError("Please enter a valid URL");
      return;
    }
    setError("");
    setShortenedUrl("");
    startProcessing(async () => {
      try {
        const data = await getShortnedUrl(url);
        setShortenedUrl(data.shortKey || "");
        setError(data.error);
      } catch (error) {
        setError("Failed to shorten URL");
      }
    });
  };

  return (
    <div className="App">
      <title>URL Shortner</title>
      <meta name="description" content="Test project for Arcube" />
      <h1 className="title">URL Shortner</h1>
      <h1>Enter your Long url to get shortened</h1>
      <div className="input-wrapper">
        <input
          type="text"
          value={url}
          onChange={(ev) => setUrl(ev.target.value)}
          className="url-input"
          data-testid="url-input"
          placeholder="Enter your long URL here"
        />
        <button onClick={shortenUrl} data-testid="shorten-button">
          Shorten
        </button>
      </div>
      <div className="status-wrapper">
        <p>&nbsp;</p>
        {isProcessing ? <p>Processing...</p> : null}
        {error ? (
          <p style={{ color: "red" }} data-testid="error-message">
            {error}
          </p>
        ) : null}
      </div>
      <div>
        <h2>Shortened URL</h2>
        <div type="text" className="shortened-url" data-testid="shortened-url">
          {shortenedUrl
            ? `${process.env.REACT_APP_API_URL}/${shortenedUrl}`
            : "Shortned url will appear here"}
        </div>
      </div>

      <footer>
        <p>
          Made with ❤️ by{" "}
          <a
            href="https://www.linkedin.com/in/yasser-mj/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Yasser Mejri
          </a>
          &nbsp;for&nbsp;
          <a
            href="https://www.arcube.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Arcube
          </a>
          &nbsp;test assessment
        </p>
      </footer>
    </div>
  );
};

export default App;
