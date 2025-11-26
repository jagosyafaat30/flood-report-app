const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Report = require('../models/Report');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  }
});

const upload = multer({ storage: storage });

// @route   POST api/reports
// @desc    Create a new report
// @access  Private
router.post('/', auth, upload.single('image'), async (req, res) => {
  console.log('POST /api/reports hit');
  try {
    const { title, description } = req.body;
    const image = req.file ? req.file.path : null;

    const newReport = new Report({
      user: req.user.id,
      title,
      description,
      image
    });

    const report = await newReport.save();
    res.status(201).json(report);
  } catch (err) {
    console.error('Error in POST /api/reports:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/reports
// @desc    Get all reports
// @access  Private
router.get('/', auth, async (req, res) => {
  console.log('GET /api/reports hit');
  try {
    const reports = await Report.find().populate('user', ['name', 'email']).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error('Error in GET /api/reports:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/reports/:id
// @desc    Get report by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  console.log(`GET /api/reports/${req.params.id} hit`);
  try {
    const report = await Report.findById(req.params.id).populate('user', ['name', 'email']);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (err) {
    console.error(`Error in GET /api/reports/${req.params.id}:`, err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/reports/:id
// @desc    Update a report
// @access  Private
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    console.log(`PUT /api/reports/${req.params.id} hit`);
    const { title, description, status } = req.body;

    // Build report object
    const reportFields = {};
    if (title) reportFields.title = title;
    if (description) reportFields.description = description;
    if (req.file) {
      reportFields.image = req.file.path;
    }

    try {
        let report = await Report.findById(req.params.id);

        if (!report) return res.status(404).json({ msg: 'Report not found' });

        // Check user authorization
        const isAdmin = req.user.role === 'admin';
        const isOwner = report.user.toString() === req.user.id;

        console.log('--- Authorization Check ---');
        console.log('Logged-in User ID (req.user.id):', req.user.id);
        console.log('Report Owner ID (report.user):', report.user.toString());
        console.log('Is Admin?', isAdmin);
        console.log('Is Owner?', isOwner);
        console.log('---------------------------');

        if (!isAdmin && !isOwner) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Handle status update
        if (status) { // if status is present in request
            if (!isAdmin) {
                return res.status(401).json({ msg: 'Not authorized to change status' });
            }
            // if admin, allow status update
            reportFields.status = status;
        }


        report = await Report.findByIdAndUpdate(
            req.params.id,
            { $set: reportFields },
            { new: true }
        );

        res.json(report);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   DELETE api/reports/:id
// @desc    Delete a report
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    console.log(`DELETE /api/reports/${req.params.id} hit`);
    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ msg: 'Report not found' });
        }

        // Check user authorization
        const isAdmin = req.user.role === 'admin';
        const isOwner = report.user.toString() === req.user.id;

        if (!isAdmin && !isOwner) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Delete image from filesystem
        if (report.image) {
            fs.unlink(path.join(__dirname, '..', report.image), (err) => {
                if (err) console.error('Failed to delete image:', err);
            });
        }

        await Report.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Report removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;

