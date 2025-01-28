# URL Shortener

This project is a simple URL shortener application built with React for the frontend and Node.js for the backend. It allows users to enter a long URL and get a shortened version of it.
This is built by [Yasser Mejri](https://www.linkedin.com/in/yasser-mj/) as a test project for [Arcube.org](https://www.arcube.org/).

## Features

- Shorten long URLs
- Redirect to the original URL using the shortened URL
- Display error messages for invalid URLs
- Display the shortened URL on success

## Technologies Used

- Frontend: React, Jest, React Testing Library
- Backend: Node.js, Express, MongoDB, Mongoose

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository:

```sh
git clone https://github.com/yourusername/url-shortener.git
```

2. Navigate to the project directory:

```sh
cd url-shortener
```

3. Install the dependencies for both the frontend and backend:

```sh
cd frontend
npm install
cd ../backend
npm install
```

4. Create a `.env` file in the `backend` directory and add the following environment variables:

```sh
MONGO_URI=mongodb://localhost:27017/urlshortener
PORT=5000
```

5. Create a `.env` file in the `frontend` directory and add the following environment variables:

```sh
REACT_APP_API_URL=http://localhost:5000
```

### Running the Application

1. Start the MongoDB server:

```sh
mongod
```

2. Start the backend server:

```sh
cd backend
npm start
```

3. Start the frontend development server:

```sh
cd ../frontend
npm start
```

The application should now be running at `http://localhost:3000`.

### Running Tests

To run the tests for the frontend, navigate to the `frontend` directory and run:

```sh
npm test
```

To run the tests for the backend, navigate to the `backend` directory and run:

```sh
npm test
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License.
