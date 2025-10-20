import express from 'express';
import Profile from '../models/Profile.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id }).populate('userId', '-password');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/me', protect, async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      profile = await Profile.create({
        userId: req.user._id,
        ...req.body
      });
    } else {
      profile = await Profile.findOneAndUpdate(
        { userId: req.user._id },
        req.body,
        { new: true, runValidators: true }
      );
    }

    const updatedProfile = await Profile.findById(profile._id).populate('userId', '-password');

    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:userId', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId }).populate('userId', '-password');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
