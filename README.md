# Flixxit

## Project Overview

Flixxit aims to be a web application with the likeness and basic feature set of OTT platforms such as Netflix, Prime Video, and AppleTV+. While the actual products are built using a complex web of microservices and infrastructure, the objective here is to build the core user functionality.

### Feature Set

1. **User Accounts**: Sign up and login functionality using email and password.
2. **User Profile**: Display account information, consumed content, and suggestions. Enable preference updates.
3. **Dashboard**: Horizontally scrollable carousels by categories and genres.
4. **Title View**: Display synopsis, rating, and other details of a chosen title.
5. **Search**: Search content like movies, web series, documentaries, etc., using the [The Movie Database API](https://www.themoviedb.org/).
6. **Watchlist**: Add programs for later viewing with an "Autoplay" feature.
7. **Rating**: Upvote or downvote programs and display the count.
8. **Video Player**: Preview or play selected content with a "Skip Intro" feature. Support at least two video qualities (HD, Auto).
9. **Payment and Subscription**: Subscribe to monthly or yearly plans and display an invoice with a "Pay Now" button. Integration with a payment gateway like Stripe is optional.
10. **About Us**: Provide information on features, origin, copyrights, terms and conditions, and help desk details.

## Frontend Setup

### Prerequisites

- **Node.js** (v14+)
- **npm** or **yarn**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/flixxit.git
   ```
2. Navigate to the frontend directory:
   ```bash
   cd flixxit/frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Frontend

1. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```
2. Open the application in your browser at `http://localhost:3000`.

## Backend Setup

### Prerequisites

- **Node.js** (v14+)
- **npm** or **yarn**
- **MongoDB**

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongo_db_connection_string
JWT_SECRET=your_jwt_secret
TMDB_API_KEY=your_tmdb_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
TMDB_URL=https://api.themoviedb.org/3
```

Replace `your_mongo_db_connection_string`, `your_jwt_secret`, `your_tmdb_api_key`, and `your_stripe_secret_key` with your actual configuration values.

### Installation

1. Navigate to the backend directory:
   ```bash
   cd flixxit/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Backend

1. Start the backend server:
   ```bash
   npm start
   # or
   yarn start
   ```
2. The server will run at `http://localhost:5000` by default.

## MongoDB Setup

1. Install and run MongoDB locally or use a cloud-based MongoDB service such as [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Replace `MONGO_URI` in the `.env` file with your connection string.

## Integrations

### The Movie Database API

- Sign up at [The Movie Database](https://www.themoviedb.org/) to get an API key.
- Add your API key to the `.env` file under `TMDB_API_KEY`.

### Stripe Integration (Optional)

- Create a Stripe account and obtain your secret key.
- Add your secret key to the `.env` file under `STRIPE_SECRET_KEY`.

## Preview and Evaluation

1. Ensure MongoDB is running and configured correctly.
2. Start the backend and frontend servers as described above.
3. Open the application at `http://localhost:3000`.
4. Test the features thoroughly using the provided instructions.

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push your changes:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
