import express from 'express';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('student'), async (req, res) => {
  try {
    const { jobId, coverLetter, resume } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status !== 'active') {
      return res.status(400).json({ message: 'Job is not active' });
    }

    const existingApplication = await Application.findOne({
      jobId,
      studentId: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    const application = await Application.create({
      jobId,
      studentId: req.user._id,
      coverLetter,
      resume
    });

    const populatedApplication = await Application.findById(application._id)
      .populate('jobId')
      .populate('studentId', 'fullName email');

    res.status(201).json(populatedApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/my-applications', protect, authorize('student'), async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate('jobId')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('studentId', 'fullName email phone')
      .populate('jobId')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/status', protect, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.id).populate('jobId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.jobId.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    const updatedApplication = await Application.findById(application._id)
      .populate('jobId')
      .populate('studentId', 'fullName email');

    res.json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('jobId')
      .populate('studentId', 'fullName email phone');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (
      application.studentId._id.toString() !== req.user._id.toString() &&
      application.jobId.recruiterId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to view this application' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
