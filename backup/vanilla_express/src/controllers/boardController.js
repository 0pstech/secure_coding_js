const boardService = require('../services/boardService');

const boardController = {
    // Get post list
    getPosts: async (req, res) => {
        try {
            const posts = await boardService.getAllPosts();
            
            // Check if it's an AJAX request
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.json(posts);
            }
            
            // For initial page load, render the index page with posts
            res.render('index', { posts });
        } catch (error) {
            console.error('Get posts error:', error);
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.status(500).json({ message: 'An error occurred while loading the post list.' });
            }
            res.status(500).render('error', { message: 'An error occurred while loading the post list.' });
        }
    },

    // Get post details
    getPost: async (req, res) => {
        try {
            const { id } = req.params;
            const post = await boardService.getPost(id);
            res.json(post);
        } catch (error) {
            console.error('Get post error:', error);
            if (error.message === 'Post not found.') {
                return res.status(404).json({ message: error.message });
            }
            res.status(500).json({ message: 'An error occurred while loading the post.' });
        }
    },

    // Create post
    createPost: async (req, res) => {
        try {
            const { title, content, permission } = req.body;
            const authorId = req.user.id;
            const result = await boardService.createPost(title, content, authorId, permission);
            res.status(201).json(result);
        } catch (error) {
            console.error('Create post error:', error);
            res.status(500).json({ message: 'An error occurred while creating the post.' });
        }
    },

    // Update post
    updatePost: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, content, permission } = req.body;
            const userId = req.user.id;
            const result = await boardService.updatePost(id, title, content, permission, userId);
            res.json(result);
        } catch (error) {
            console.error('Update post error:', error);
            if (error.message === 'Post not found.') {
                return res.status(404).json({ message: error.message });
            }
            if (error.message === 'You do not have permission to edit this post.') {
                return res.status(403).json({ message: error.message });
            }
            res.status(500).json({ message: 'An error occurred while updating the post.' });
        }
    },

    // Delete post
    deletePost: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const result = await boardService.deletePost(id, userId);
            res.json(result);
        } catch (error) {
            console.error('Delete post error:', error);
            if (error.message === 'Post not found.') {
                return res.status(404).json({ message: error.message });
            }
            if (error.message === 'You do not have permission to delete this post.') {
                return res.status(403).json({ message: error.message });
            }
            res.status(500).json({ message: 'An error occurred while deleting the post.' });
        }
    },

    // Add comment
    addComment: async (req, res) => {
        try {
            const { id } = req.params;
            const { content } = req.body;
            const userId = req.user.id;
            const result = await boardService.addComment(id, content, userId);
            res.status(201).json(result);
        } catch (error) {
            console.error('Add comment error:', error);
            res.status(500).json({ message: 'An error occurred while adding the comment.' });
        }
    },

    // Delete comment
    deleteComment: async (req, res) => {
        try {
            const { id, commentId } = req.params;
            const userId = req.user.id;
            await boardService.deleteComment(id, commentId, userId);
            res.json({ message: 'Comment deleted successfully.' });
        } catch (error) {
            console.error('Delete comment error:', error);
            res.status(500).json({ message: 'An error occurred while deleting the comment.' });
        }
    }
};

module.exports = boardController; 