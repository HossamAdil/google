const { getAllTours ,createTour ,filterionTrip , getOneTour , updateTour , deleteTour , getRelatedTours} = require('../Controllers/tourController');
const toursRouters = require('express').Router()

toursRouters.get('/tours',getAllTours)
toursRouters.post('/create-tours', createTour);
toursRouters.post('/filter-trips', filterionTrip);
toursRouters.get('/tour/:id', getOneTour);
toursRouters.put('/update-tour/:id', updateTour);
toursRouters.delete('/delete-tour/:id', deleteTour);
toursRouters.post('/related-tours', getRelatedTours);

module.exports = toursRouters;