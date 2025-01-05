require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes'); // Import all routes

const app = express();

// Middleware



app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'healthcheck!' });
});

app.use(bodyParser.json());

// Routes
// All API routes
app.use('/api', routes);
// Database connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error(error));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
