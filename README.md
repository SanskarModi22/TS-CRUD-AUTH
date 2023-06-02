# TS Express Node Authentication CRUD

This is a sample project built with Express, Node.js, and TypeScript that provides authentication functionality (register, login), user CRUD operations (create, read, update, delete), and a user listing endpoint.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:

```
git clone https://github.com/SanskarModi22/TS-CRUD-AUTH.git
```

2. Install dependencies:

```
cd TS-CRUD-AUTH
npm install
```

3. Set up environment variables:

Create a `.env` file in the project root directory and define the following environment variables:

```
PORT=<port_number>
MONGODB_URI=<mongodb_connection_uri>
```

Replace `<port_number>` with the desired port number to run the server on and `<mongodb_connection_uri>` with the URI for your MongoDB database.

4. Build and run the project:

```
npm run build
npm start
```

The server should now be running on the specified port.

## API Endpoints

### Authentication

- `POST /auth/register`: Register a new user. Requires the following request body parameters: `email`, `password`, and `username`.

- `POST /auth/login`: Log in an existing user. Requires the following request body parameters: `email` and `password`.

### User CRUD Operations

- `GET /users`: Get a list of all users.

- `GET /users/:id`: Get a specific user by ID.

- `PUT /users/:id`: Update a specific user by ID. Requires the `username` parameter in the request body.

- `DELETE /users/:id`: Delete a specific user by ID.

### Authentication Middleware

The project includes an authentication middleware (`isAuthenticated`) that can be used to protect routes that require authentication. To use this middleware, simply add it as a parameter to the route handler function.

```typescript
router.get('/protected', isAuthenticated, (req: Request, res: Response) => {
  // Route logic here
});
```

## Dependencies

The project utilizes the following dependencies:

- Express: Web application framework for Node.js.
- MongoDB and Mongoose: Database and ODM for MongoDB.
- Joi: Schema validation library.
- Dotenv: Environment variable management.
- Body-parser: Middleware for parsing request bodies.
- Compression: Middleware for response compression.
- Cookie-parser: Middleware for parsing cookies.
- CORS: Middleware for handling cross-origin resource sharing.
- Lodash: Utility library.

## Contributing

Contributions to the project are welcome. Feel free to open issues and submit pull requests.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for more details.
