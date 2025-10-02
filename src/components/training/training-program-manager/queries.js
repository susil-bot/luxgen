/**
 * Training Program Manager - Database Queries
 * MongoDB queries and database operations for training programs
 */

const mongoose = require('mongoose');

/**
 * Build query for training programs with filters
 */
function buildTrainingProgramQuery(filters = {}) {
  const query = {};
  
  if (filters.status) {
    query.status = filters.status;
  }
  
  if (filters.category) {
    query.category = filters.category;
  }
  
  if (filters.level) {
    query.level = filters.level;
  }
  
  if (filters.type) {
    query.type = filters.type;
  }
  
  if (filters.instructor) {
    query.instructor = filters.instructor;
  }
  
  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive;
  }
  
  if (filters.isPublic !== undefined) {
    query.isPublic = filters.isPublic;
  }
  
  if (filters.isFeatured !== undefined) {
    query.isFeatured = filters.isFeatured;
  }
  
  if (filters.priceRange) {
    query.price = {
      $gte: filters.priceRange.min,
      $lte: filters.priceRange.max
    };
  }
  
  if (filters.durationRange) {
    query.duration = {
      $gte: filters.durationRange.min,
      $lte: filters.durationRange.max
    };
  }
  
  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }
  
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } },
      { shortDescription: { $regex: filters.search, $options: 'i' } },
      { tags: { $in: [new RegExp(filters.search, 'i')] } }
    ];
  }
  
  return query;
}

/**
 * Build sort object for training programs
 */
function buildTrainingProgramSort(sortBy = 'createdAt', sortOrder = 'desc') {
  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
  return sort;
}

/**
 * Get training programs with pagination
 */
async function getTrainingPrograms(filters = {}, options = {}) {
  const TrainingProgram = mongoose.model('TrainingProgram');
  
  const query = buildTrainingProgramQuery(filters);
  const sort = buildTrainingProgramSort(filters.sortBy, filters.sortOrder);
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const skip = (page - 1) * limit;
  
  const [programs, total] = await Promise.all([
    TrainingProgram.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('instructor', 'firstName lastName email')
      .lean(),
    TrainingProgram.countDocuments(query)
  ]);
  
  return {
    programs,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit)
  };
}

/**
 * Get training program by ID
 */
async function getTrainingProgramById(id) {
  const TrainingProgram = mongoose.model('TrainingProgram');
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid program ID');
  }
  
  const program = await TrainingProgram.findById(id)
    .populate('instructor', 'firstName lastName email')
    .populate('modules')
    .lean();
  
  if (!program) {
    throw new Error('Training program not found');
  }
  
  return program;
}

/**
 * Create new training program
 */
async function createTrainingProgram(programData) {
  const TrainingProgram = mongoose.model('TrainingProgram');
  
  const program = new TrainingProgram(programData);
  await program.save();
  
  return program.toObject();
}

/**
 * Update training program
 */
async function updateTrainingProgram(id, updateData) {
  const TrainingProgram = mongoose.model('TrainingProgram');
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid program ID');
  }
  
  const program = await TrainingProgram.findByIdAndUpdate(
    id,
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).populate('instructor', 'firstName lastName email');
  
  if (!program) {
    throw new Error('Training program not found');
  }
  
  return program.toObject();
}

/**
 * Delete training program
 */
async function deleteTrainingProgram(id) {
  const TrainingProgram = mongoose.model('TrainingProgram');
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid program ID');
  }
  
  const program = await TrainingProgram.findByIdAndDelete(id);
  
  if (!program) {
    throw new Error('Training program not found');
  }
  
  return true;
}

/**
 * Get training program statistics
 */
async function getTrainingProgramStats() {
  const TrainingProgram = mongoose.model('TrainingProgram');
  
  const stats = await TrainingProgram.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        active: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
        draft: { $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] } },
        published: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } },
        totalEnrollments: { $sum: '$analytics.enrollments' },
        totalViews: { $sum: '$analytics.views' },
        averageRating: { $avg: '$analytics.rating' }
      }
    }
  ]);
  
  return stats[0] || {
    total: 0,
    active: 0,
    draft: 0,
    published: 0,
    totalEnrollments: 0,
    totalViews: 0,
    averageRating: 0
  };
}

/**
 * Get programs by category
 */
async function getProgramsByCategory(category) {
  const TrainingProgram = mongoose.model('TrainingProgram');
  
  return await TrainingProgram.find({ category })
    .populate('instructor', 'firstName lastName email')
    .lean();
}

/**
 * Get programs by status
 */
async function getProgramsByStatus(status) {
  const TrainingProgram = mongoose.model('TrainingProgram');
  
  return await TrainingProgram.find({ status })
    .populate('instructor', 'firstName lastName email')
    .lean();
}

/**
 * Search training programs
 */
async function searchTrainingPrograms(searchTerm, filters = {}) {
  const TrainingProgram = mongoose.model('TrainingProgram');
  
  const searchQuery = {
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { shortDescription: { $regex: searchTerm, $options: 'i' } },
      { tags: { $in: [new RegExp(searchTerm, 'i')] } }
    ]
  };
  
  const query = { ...searchQuery, ...buildTrainingProgramQuery(filters) };
  const sort = buildTrainingProgramSort(filters.sortBy, filters.sortOrder);
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const skip = (page - 1) * limit;
  
  const [programs, total] = await Promise.all([
    TrainingProgram.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('instructor', 'firstName lastName email')
      .lean(),
    TrainingProgram.countDocuments(query)
  ]);
  
  return {
    programs,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit)
  };
}

/**
 * Get featured programs
 */
async function getFeaturedPrograms(limit = 10) {
  const TrainingProgram = mongoose.model('TrainingProgram');
  
  return await TrainingProgram.find({ 
    isFeatured: true, 
    isActive: true, 
    isPublic: true 
  })
    .sort({ 'analytics.rating': -1, 'analytics.enrollments': -1 })
    .limit(limit)
    .populate('instructor', 'firstName lastName email')
    .lean();
}

/**
 * Get popular programs
 */
async function getPopularPrograms(limit = 10) {
  const TrainingProgram = mongoose.model('TrainingProgram');
  
  return await TrainingProgram.find({ 
    isActive: true, 
    isPublic: true 
  })
    .sort({ 'analytics.enrollments': -1, 'analytics.views': -1 })
    .limit(limit)
    .populate('instructor', 'firstName lastName email')
    .lean();
}

/**
 * Get programs by instructor
 */
async function getProgramsByInstructor(instructorId) {
  const TrainingProgram = mongoose.model('TrainingProgram');
  
  return await TrainingProgram.find({ instructor: instructorId })
    .populate('instructor', 'firstName lastName email')
    .lean();
}

/**
 * Get program analytics
 */
async function getProgramAnalytics(programId) {
  const TrainingProgram = mongoose.model('TrainingProgram');
  
  if (!mongoose.Types.ObjectId.isValid(programId)) {
    throw new Error('Invalid program ID');
  }
  
  const program = await TrainingProgram.findById(programId)
    .select('analytics')
    .lean();
  
  if (!program) {
    throw new Error('Training program not found');
  }
  
  return program.analytics;
}

/**
 * Update program analytics
 */
async function updateProgramAnalytics(programId, analyticsData) {
  const TrainingProgram = mongoose.model('TrainingProgram');
  
  if (!mongoose.Types.ObjectId.isValid(programId)) {
    throw new Error('Invalid program ID');
  }
  
  const program = await TrainingProgram.findByIdAndUpdate(
    programId,
    { 
      $set: { 
        'analytics': analyticsData,
        updatedAt: new Date()
      }
    },
    { new: true }
  );
  
  if (!program) {
    throw new Error('Training program not found');
  }
  
  return program.analytics;
}

module.exports = {
  buildTrainingProgramQuery,
  buildTrainingProgramSort,
  getTrainingPrograms,
  getTrainingProgramById,
  createTrainingProgram,
  updateTrainingProgram,
  deleteTrainingProgram,
  getTrainingProgramStats,
  getProgramsByCategory,
  getProgramsByStatus,
  searchTrainingPrograms,
  getFeaturedPrograms,
  getPopularPrograms,
  getProgramsByInstructor,
  getProgramAnalytics,
  updateProgramAnalytics
};
