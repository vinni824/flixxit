const jwt = require('jsonwebtoken');
const Subscription = require('../models/Subscription');

const protect =  async(req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
 
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};



const checkSubscription = async (req, res, next) => {
  try {
    const userId = req.userId; // Assuming the userId is set by the authentication middleware (JWT)

    // Find active subscription for the user
    const subscription = await Subscription.findOne({ userId, isActive: true });

    if (!subscription) {
      return res.status(403).json({ message: 'You need an active subscription to access this content' });
    }

    // Check if the subscription has expired
    const currentDate = new Date();
    if (subscription.endDate < currentDate) {
      // If expired, deactivate the subscription
      subscription.isActive = false;
      await subscription.save();
      return res.status(403).json({ message: 'Your subscription has expired. Please renew.' });
    }

    // Attach subscription details to the request for further use
    req.subscription = subscription;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error in checking subscription:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {checkSubscription,protect};

