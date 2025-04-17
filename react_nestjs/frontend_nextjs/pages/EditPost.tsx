import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, updatePost } from '../api/posts';
import { UpdatePostDto } from '../types';

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UpdatePostDto>({
    title: '',
    content: '',
    permission: 'public'
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHtmlMode, setIsHtmlMode] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getPost(Number(id));
        setFormData({
          title: post.title,
          content: post.content,
          permission: post.permission || 'public'
        });
      } catch (err) {
        setError('Failed to load post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePost(Number(id), formData);
      navigate(`/posts/${id}`);
    } catch (err) {
      setError('Failed to update post. Please try again.');
    }
  };

  const toggleEditMode = () => {
    setIsHtmlMode(!isHtmlMode);
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">
            <h3 className="text-center mb-0">Edit Post</h3>
          </div>
          <div className="card-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label htmlFor="content" className="form-label mb-0">Content</label>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="editModeSwitch"
                      checked={isHtmlMode}
                      onChange={toggleEditMode}
                    />
                    <label className="form-check-label" htmlFor="editModeSwitch">
                      HTML Mode {isHtmlMode ? 'On' : 'Off'}
                    </label>
                  </div>
                </div>
                <textarea
                  className="form-control"
                  id="content"
                  name="content"
                  rows={10}
                  value={formData.content}
                  onChange={handleChange}
                  required
                  style={{ fontFamily: isHtmlMode ? 'monospace' : 'inherit' }}
                />
                {isHtmlMode && (
                  <div className="form-text text-muted mt-1">
                    You can edit content using HTML tags.
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="permission" className="form-label">Visibility</label>
                <select
                  className="form-select"
                  id="permission"
                  name="permission"
                  value={formData.permission}
                  onChange={handleChange}
                  required
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate(`/posts/${id}`)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 