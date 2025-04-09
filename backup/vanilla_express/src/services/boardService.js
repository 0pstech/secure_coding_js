const postModel = require('../models/post');

const boardService = {
    
    // 모든 게시글 조회
    async getAllPosts() {
        try {
            return await postModel.getAllPosts();
        } catch (error) {
            console.error('Error in boardService.getAllPosts:', error);
            throw error;
        }
    },

    // 특정 게시글 조회
    async getPostById(id) {
        try {
            const post = await postModel.getPostById(id);
            if (!post) {
                throw new Error('Post not found');
            }
            return post;
        } catch (error) {
            console.error('Error in boardService.getPostById:', error);
            throw error;
        }
    },

    // 게시글 생성
    async createPost({ title, content, permission, author_id }) {
        try {
            if (!title || !content || !permission || !author_id) {
                throw new Error('Missing required fields');
            }
            return await postModel.createPost({ title, content, permission, author_id });
        } catch (error) {
            console.error('Error in boardService.createPost:', error);
            throw error;
        }
    },

    // 게시글 수정
    async updatePost(id, { title, content, permission }) {
        try {
            if (!title || !content || !permission) {
                throw new Error('Missing required fields');
            }
            const success = await postModel.updatePost(id, { title, content, permission });
            if (!success) {
                throw new Error('Post not found');
            }
            return success;
        } catch (error) {
            console.error('Error in boardService.updatePost:', error);
            throw error;
        }
    },

    // 게시글 삭제
    async deletePost(id) {
        try {
            const success = await postModel.deletePost(id);
            if (!success) {
                throw new Error('Post not found');
            }
            return success;
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