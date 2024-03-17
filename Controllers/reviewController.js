const Review = require('../Model/reviewModel');
const User = require('../Model/registerModel');
const Tour = require('../Model/tourModel');

exports.postReview = async (req, res) => {
  try {
    const { userId, tourId, name, email, reviewTitle, reviewText, rating } = req.body;

    // Check if the user and tour exist
    const user = await User.findById(userId);
    const tour = await Tour.findById(tourId);
    if (!user || !tour) {
      return res.status(404).json({ message: 'User or Tour not found' });
    }

    // Check if the user has already submitted a review for this tour
    const existingReview = await Review.findOne({ userId, tourId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already submitted a review for this tour' });
    }

    // Create a new review associated with the user's ID
    const newReview = new Review({
      userId: user._id,
      tourId: tour._id,
      reviewText,
      rating,
      reviewTitle, // You can add a default title or require it in the request
      reviewDate: new Date()
    });

    await newReview.save();

    // Add review to tour's reviews array
    tour.reviews.push(newReview._id);
    await tour.save();

    // Add review to user's reviews array
    user.reviews.push(newReview._id);
    await user.save();

    res.status(200).json({ message: 'Review submitted successfully', reviewId: newReview._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReviewsByUserId = async (req, res) => {
  try {
      const { userId } = req.params;
      const reviews = await Review.find({ userId }).populate('userId', 'firstName lastName').select('_id reviewText rating reviewTitle userId');
  
      res.status(200).json(reviews);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};

exports.getReviewsByTourId = async (req, res) => {
  try {
      const { tourId } = req.params;
      const reviews = await Review.find({ tourId }).populate('userId', 'firstName lastName').select('_id reviewText rating reviewTitle userId');
  
      res.status(200).json(reviews);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};

exports.getReviewDetailsByPostId = async (req, res) => {
  try {
    const { postId } = req.params;

    // Find the review by post ID
    const review = await Review.findOne({ postId }).populate('userId', 'firstName lastName');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Extract user details from the populated user object
    const { firstName, lastName } = review.userId;

    // Construct the response object
    const reviewDetails = {
      firstName,
      lastName,
      review: {
        reviewText: review.reviewText,
        rating: review.rating,
        reviewTitle: review.reviewTitle,
        reviewDate: review.reviewDate,
        // Include other fields of the review as needed
      }
    };

    res.status(200).json(reviewDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

