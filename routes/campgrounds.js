const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');


router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', isLoggedIn, (req, res) => {

    //coming from passport
    // this is logic to authenicate 
    // and it will be moved to a middleware file, 
    // which we can use for any route we want to protect
    // if(!req.isAuthenticated()) {
    //     req.flash('error', 'You must be signed in');
    //     return res.redirect('/login');
    // }
    res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid campground data', 400);
    const campground = new Campground(req.body.campground);
    // We associate the user that is logged in with the newly made campground
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made new campground.');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id',catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: 'author'
    }).populate('author');
    console.log(campground);
    if(!campground){
        req.flash('error', 'No campground found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));

// Keeping isLoggedIn middle provides more specific feedback, better to find current user is valid and then see if they are an author
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'No campground found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    
    const { id } = req.params;

    // Authorization Logic to be put in a middleware
    // const campground = await Campground.findById(id);
    // if (!campground.author.equals(req.user.id)){
    //     req.flash('error', 'You do not have permission to do that');
    //     return res.redirect(`/campgrounds/${id}`);
    // };

    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
}));

module.exports = router;