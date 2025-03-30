import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts } from '../api/posts';
import { useAuth } from '../contexts/AuthContext';
import { Post } from '../types';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        console.log('게시글 목록:', data);
        setPosts(data);
      } catch (err) {
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostClick = (postId: number) => {
    console.log('클릭된 게시글 ID:', postId);
    navigate(`/posts/${postId.toString()}`);
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

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>게시글 목록</h2>
        {isAuthenticated && (
          <button
            className="btn btn-primary"
            onClick={() => navigate('/posts/new')}
          >
            글쓰기
          </button>
        )}
      </div>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th style={{ width: '50%' }}>제목</th>
              <th style={{ width: '20%' }}>작성자</th>
              <th style={{ width: '30%' }}>작성일</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr
                key={post.id}
                onClick={() => handlePostClick(post.id)}
                style={{ cursor: 'pointer' }}
                className="post-row"
              >
                <td>{post.title}</td>
                <td>{post.author.username}</td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 