const express = require('express');
const moviesController = require('../controllers/moviesController');
const usersController = require('../controllers/usersController')
const subscriptionController = require('../controllers/subscriptionController')
const { protect, checkSubscription } = require('../middlewares/authMiddleware');

const router = express.Router();

// Movies Routes
router.get('/movie/configuration',protect,moviesController.getConfiguration);
router.get('/movie/genres',protect,moviesController.getGenres)
router.get('/movies/banner', protect, moviesController.getBannerContent);// dashboard movies
router.get('/movies/trending', protect, moviesController.getTrendingContent);// dashboard movies
router.get('/movies/popular',protect,moviesController.getPopularContent)
router.get('/movies/top_rated',protect,moviesController.getTopratedContent)
router.get('/movies/explore',protect,moviesController.exploreContent)
router.get('/movies/search',protect,  moviesController.searchMovies); // Search movies
router.get('/movies/:type/:id',protect, moviesController.getMovieDetails); // Movie details by ID
router.get('/movies/:type/:id/similar',protect, moviesController.getSimilarMovieDetails)
router.get('/movies/:type/:id/recommendations',protect, moviesController.getRecommendationsMovieDetails)
router.get('/movies/:type/:id/videos',protect, moviesController.getMovieVideos)
router.get('/movies/:type/:id/credits',protect, moviesController.getMovieCredits)
router.get('/movies/:type/:id/metadata',protect, moviesController.getMovieMetaDetails)
router.post('/movies/upvote',protect,  moviesController.upvoteMovie); //upvote movie
router.post('/movies/downvote',protect,  moviesController.downvoteMovie);//downvote movie
router.post('/movies/add-video',protect, moviesController.addVideoToMovie);// add video to movie

// User Routes
router.post('/users/register', usersController.register); // Register user
router.post('/users/login', usersController.login); // Login user
router.get('/users/profile',protect,  usersController.getProfile); // Get user profile
router.patch('/users/update-profile',protect,  usersController.updateProfile); // Update user profile
router.post('/users/add-to-watchlist',protect, usersController.addToWatchlist); // add to watch list
router.post('/users/remove-from-watchlist',protect, usersController.removeFromWatchlist); //remove from watch list
router.get('/users/mylist',protect,usersController.getWatchlist)

// Payment and Subscription Routes
router.post('/payment/subscribe/create',protect, subscriptionController.createSubscription);// add subscription
router.get('/payment/invoice/:id', protect, subscriptionController.getInvoice); // get invoice

module.exports = router;
