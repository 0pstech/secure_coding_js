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
      setError('로그인이 필요합니다.');
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
      setError('게시글 작성에 실패했습니다.');
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
        로그인이 필요한 기능입니다.
      </div>
    );
  }

  return (
    <div className="container form-container">
      <h2 className="mb-4">게시글 작성</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">제목</label>
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
          <label htmlFor="content" className="form-label">내용</label>
          <div className="editor-container">
            <div className="editor-tabs">
              <div
                className={`editor-tab ${!isHtmlMode ? 'active' : ''}`}
                onClick={() => handleModeChange('text')}
              >
                텍스트 모드
              </div>
              <div
                className={`editor-tab ${isHtmlMode ? 'active' : ''}`}
                onClick={() => handleModeChange('html')}
              >
                HTML 모드
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
              미리보기 표시
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
              공개 게시글
            </label>
          </div>
          <small className="text-muted">
            체크 해제 시 비공개 게시글로 작성됩니다.
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
            취소
          </button>
          <button type="submit" className="btn btn-primary">
            작성하기
          </button>
        </div>
      </form>
    </div>
  );
} 