const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createSubscription = async (req, res) => {
  try {
    const { planType } = req.body;
    const { userId } = req;

    if (!subscriptionPlans[planType]) {
      return res.status(400).json({ error: 'Invalid subscription plan' });
    }

    const price = subscriptionPlans[planType];
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(startDate.getFullYear() + (planType === 'yearly' ? 1 : 0));

    const newSubscription = new Subscription({
      userId,
      planType,
      startDate,
      expiryDate,
    });

    await newSubscription.save();

    // Create a Stripe checkout session for payment
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Subscription - ${planType} Plan`,
            },
            unit_amount: price * 100, // Stripe requires amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/subscription/success`,
      cancel_url: `${process.env.CLIENT_URL}/subscription/cancel`,
    });

    res.status(200).json({ message: 'Subscription created', invoice: { price, planType, startDate, expiryDate }, sessionId: session.id });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
};


exports.getInvoice = async (req, res) => {
  try {
    const userId = req.userId; // Get user ID from protected route (assuming it's set by middleware)
    const invoiceId = req.params.id;

    // Find the payment invoice by ID
    const invoice = await Payment.findOne({ _id: invoiceId, userId }).populate('userId', 'email name');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found or you do not have access to this invoice.' });
    }

    // Respond with the invoice details
    res.status(200).json({
      invoiceNumber: invoice.invoiceNumber,
      subscriptionType: invoice.subscriptionType,
      amount: invoice.amount,
      status: invoice.status,
      date: invoice.date,
      user: invoice.userId,  // User details
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};