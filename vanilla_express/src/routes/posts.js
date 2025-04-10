const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const boardService = require('../services/boardService');

// Get new post form (must come before /:id)
router.get('/new', isAuthenticated, (req, res) => {
    res.render('write', { 
        title: 'Write New Post',
        post: null,
        user: req.user
    });
});

// Get edit post form
router.get('/:id/edit', isAuthenticated, async (req, res) => {
    try {
        const post = await boardService.getPostById(req.params.id);
        if (!post) {
            return res.status(404).render('error', { 
                title: 'Error',
                message: 'Post not found' 
            });
        }
        
        // Check if user is author or admin
        if (post.author_id !== req.user.id && !req.user.is_admin) {
            return res.status(403).render('error', { 
                title: 'Access Denied',
                message: 'You do not have permission to edit this post' 
            });
        }
        
        res.render('write', { 
            title: 'Edit Post',
            post,
            user: req.user
        });
    } catch (error) {
        console.error('Error in GET /posts/:id/edit:', error);
        res.status(500).render('error', { 
            title: 'Error',
            message: 'Failed to load post for editing' 
        });
    }
});

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await boardService.getAllPosts();
        // Check if it's an AJAX request
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.json(posts);
        }
        // For initial page load, render the index page with posts
        res.render('index', { 
            title: 'Posts',
            posts,
            user: req.user 
        });
    } catch (error) {
        console.error('Error in GET /posts:', error);
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(500).json({ error: 'Failed to fetch posts' });
        }
        res.status(500).render('error', { 
            title: 'Error',
            message: 'Failed to fetch posts' 
        });
    }
});

// Get a single post
router.get('/:id', async (req, res) => {
    try {
        const post = await boardService.getPostById(req.params.id);
        if (!post) {
            return res.status(404).render('error', { 
                title: 'Error',
                message: 'Post not found',
                user: req.user // user 정보 전달 유지
            });
        }
        
        // Check if it's an AJAX request
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.json(post);
        }
        
        // For browser requests, render the post view
        res.render('post', { 
            title: post.title,
            post,
            user: req.user
        });
    } catch (error) {
        console.error('Error in GET /posts/:id:', error);
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(500).json({ error: 'Failed to fetch post' });
        }
        // **취약점**: 잡힌 에러 객체 전체를 error.ejs 템플릿으로 전달!
        res.status(500).render('error', {
            title: 'Database Error (Intentionally Exposed)',
            message: 'An error occurred while fetching the post. Details below:',
            // 실제 운영 환경에서는 절대 error 객체를 직접 전달하면 안됨!
            error: error, // 에러 객체 전달
            user: req.user // 헤더/푸터 위해 user 정보는 계속 전달
        });
    }
});

// Create a new post (requires authentication)
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const { title, content, permission } = req.body;
        if (!title || !content || !permission) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const postData = {
            title,
            content,
            permission,
            author_id: req.user.id
        };
        const postId = await boardService.createPost(postData);
        res.status(201).json({ id: postId });
    } catch (error) {
        console.error('Error in POST /posts:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Update a post (requires authentication)
router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const { title, content, permission } = req.body;
        if (!title || !content || !permission) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Get the post to check ownership
        const post = await boardService.getPostById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if user is author or admin
        if (post.author_id !== req.user.id && !req.user.is_admin) {
            return res.status(403).json({ error: 'You do not have permission to edit this post' });
        }

        const success = await boardService.updatePost(req.params.id, { title, content, permission });
        if (!success) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json({ message: 'Post updated successfully' });
    } catch (error) {
        console.error('Error in PUT /posts/:id:', error);
        res.status(500).json({ error: 'Failed to update post' });
    }
});

// Delete a post (requires authentication)
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const success = await boardService.deletePost(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error in DELETE /posts/:id:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

module.exports = router; 