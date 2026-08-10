const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// GET - Get all projects (Database එකෙන්)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    console.log(`📁 Found ${projects.length} projects in database`);
    res.json(projects);
  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// POST - Create new project (Database එකට Save කරන්න)
router.post('/', async (req, res) => {
  try {
    console.log('📝 Creating project:', req.body);
    
    const { title, description, eventDate, eventLocation, githubLink, status, image } = req.body;
    
    // Validate
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }
    
    if (!description || description.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Description is required'
      });
    }
    
    // Create new project
    const project = new Project({
      title: title.trim(),
      description: description.trim(),
      eventDate: eventDate || '',
      eventLocation: eventLocation || '',
      githubLink: githubLink || '',
      status: status || 'In Progress',
      image: image || ''
    });
    
    // Save to database
    const savedProject = await project.save();
    console.log('✅ Project saved to database:', savedProject._id);
    
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: savedProject
    });
  } catch (error) {
    console.error('❌ Error creating project:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// PUT - Update project (Database එකේ Update කරන්න)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📝 Updating project: ${id}`);
    
    const { title, description, eventDate, eventLocation, githubLink, status, image } = req.body;
    
    const updateData = {
      title: title?.trim(),
      description: description?.trim(),
      eventDate: eventDate || '',
      eventLocation: eventLocation || '',
      githubLink: githubLink || '',
      status: status || 'In Progress',
      image: image || ''
    };
    
    // Find and update in database
    const project = await Project.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    console.log('✅ Project updated in database:', project._id);
    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    console.error('❌ Error updating project:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// DELETE - Delete project (Database එකෙන් Delete කරන්න)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Deleting project: ${id}`);
    
    // Find and delete from database
    const project = await Project.findByIdAndDelete(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    console.log('✅ Project deleted from database:', id);
    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting project:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

module.exports = router;