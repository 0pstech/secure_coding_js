import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api/posts';
import { useAuth } from '../contexts/AuthContext';

export default function CreatePost() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Login is required.');
      return;
    }

    try {
      const postData = {
        title,
        content: isHtmlMode ? htmlContent : content,
        permission: isPublic ? 'public' : 'private',
      };
      await createPost(postData);
      navigate('/');
    } catch (err) {
      setError('Failed to create post.');
    }
  };

  const handleModeChange = (mode: 'text' | 'html') => {
    setIsHtmlMode(mode === 'html');
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isHtmlMode) {
      setHtmlContent(e.target.value);
    } else {
      setContent(e.target.value);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="alert alert-warning" role="alert">
        Login is required to use this feature.
      </div>
    );
  }

  return (
    <div className="container form-container">
      <h2 className="mb-4">Create Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">Content</label>
          <div className="editor-container">
            <div className="editor-tabs">
              <div
                className={`editor-tab ${!isHtmlMode ? 'active' : ''}`}
                onClick={() => handleModeChange('text')}
              >
                Text Mode
              </div>
              <div
                className={`editor-tab ${isHtmlMode ? 'active' : ''}`}
                onClick={() => handleModeChange('html')}
              >
                HTML Mode
              </div>
            </div>
            <div className="editor-content">
              <textarea
                id="textEditor"
                className="form-control"
                value={content}
                onChange={handleContentChange}
                style={{ display: isHtmlMode ? 'none' : 'block' }}
              />
              <textarea
                id="htmlEditor"
                className="form-control"
                value={htmlContent}
                onChange={handleContentChange}
                style={{ display: isHtmlMode ? 'block' : 'none' }}
              />
            </div>
          </div>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="showPreview"
              checked={showPreview}
              onChange={(e) => setShowPreview(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="showPreview">
              Preview
            </label>
          </div>
          {showPreview && (
            <div
              id="preview"
              dangerouslySetInnerHTML={{
                __html: isHtmlMode ? htmlContent : content.replace(/\n/g, '<br>'),
              }}
            />
          )}
        </div>
        <div className="mb-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="isPublic">
              Public Post
            </label>
          </div>
          <small className="text-muted">
            Uncheck to create a private post.
          </small>
        </div>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </div>
      </form>
    </div>
  );
} 