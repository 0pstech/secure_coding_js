import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Post } from '../types';
import { getPost, deletePost } from '../api/posts';
import { useAuth } from '../contexts/AuthContext';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError('잘못된 게시글 ID입니다.');
        setLoading(false);
        return;
      }

      try {
        const postId = parseInt(id, 10);
        if (isNaN(postId)) {
          throw new Error('잘못된 게시글 ID입니다.');
        }
        const data = await getPost(postId);
        setPost(data);
      } catch (err) {
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!id) {
      setError('잘못된 게시글 ID입니다.');
      return;
    }

    if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const postId = parseInt(id, 10);
      if (isNaN(postId)) {
        throw new Error('잘못된 게시글 ID입니다.');
      }
      await deletePost(postId);
      navigate('/');
    } catch (err) {
      setError('게시글 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">로딩중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="alert alert-warning" role="alert">
        게시글을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0">{post.title}</h3>
              <div>
                <span className="text-muted me-3">
                  작성자: {post.author.username}
                </span>
                <span className="text-muted">
                  작성일: {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="mb-4">
              {post.content.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/')}
              >
                목록으로
              </button>
              {isAuthenticated && (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary me-2"
                    onClick={() => navigate(`/posts/${id}/edit`)}
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDelete}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 