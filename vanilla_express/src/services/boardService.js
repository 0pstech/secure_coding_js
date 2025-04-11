const { post } = require('../models');

const boardService = {
    
    // Get all posts
    async getAllPosts() {
        try {
            return await post.getAllPosts();
        } catch (error) {
            console.error('Error in boardService.getAllPosts:', error);
            throw error;
        }
    },

    // Get post by ID
    async getPostById(id) {
        try {
            // filtering id
            const numericid = Number(id);

            if (!Number.isInteger(numericid) || numericid <= 0) {
                throw new Error('Invalid post ID');
            }

            const postData = await post.getPostById(numericid);
            if (!postData) {
                throw new Error('Post not found');
            }
            return postData;
        } catch (error) {
            console.error('Error in boardService.getPostById:', error);
            throw error;
        }
    },

    // Create post
    async createPost(postData) {
        try {
            if (!postData.title || !postData.content || !postData.permission || !postData.author_id) {
                throw new Error('Missing required fields');
            }
            return await post.createPost(postData);
        } catch (error) {
            console.error('Error in boardService.createPost:', error);
            throw error;
        }
    },

    // Update post
    async updatePost(id, postData) {
        try {
            const existingPost = await post.getPostById(id);
            if (!existingPost) {
                throw new Error('Post not found');
            }
            
            // Sanitize post data here if needed
            
            return await post.updatePost(id, postData);
        } catch (error) {
            console.error('Error in boardService.updatePost:', error);
            throw error;
        }
    },

    // Delete post
    async deletePost(id) {
        try {
            const existingPost = await post.getPostById(id);
            if (!existingPost) {
                throw new Error('Post not found');
            }
            return await post.deletePost(id);
        } catch (error) {
            console.error('Error in boardService.deletePost:', error);
            throw error;
        }
    },

    // Add comment
    addComment: async (postId, content, userId) => {
        try {
            // This would need a Comments model
            // For now, we'll simulate the response
            return {
                commentId: Date.now(), // Simulated ID
                postId,
                content,
                userId
            };
        } catch (error) {
            console.error('Error in addComment:', error);
            throw error;
        }
    },

    // Delete comment
    deleteComment: async (postId, commentId, userId) => {
        try {
            // This would need a Comments model
            // For now, we'll simulate the deletion check
            if (!postId || !commentId || !userId) {
                throw new Error('Comment not found or unauthorized.');
            }
        } catch (error) {
            console.error('Error in deleteComment:', error);
            throw error;
        }
    }
};

module.exports = boardService; 