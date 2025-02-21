import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function JoinLecture() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate(`/login?return_to=${encodeURIComponent(`/join/${code}`)}`);
      return;
    }
  }, [code, navigate]);

  const handleJoinLecture = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/lectures/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify({ code })
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/dashboard/${code}-${data.id}`);
      } else {
        const errorData = await response.json();
        setError(errorData.message || '수업 참여에 실패했습니다.');
      }
    } catch (error) {
      setError('수업 참여 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center mb-6">수업 참여하기</h2>

          <div className="mb-6">
            <div className="text-center mb-4">
              <p className="text-gray-600">초대 코드:</p>
              <p className="text-xl font-mono mt-2">{code}</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
                  {error}
                </div>
            )}

            <button
                onClick={handleJoinLecture}
                disabled={loading}
                className={`w-full py-2 px-4 rounded-md text-white ${
                    loading
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {loading ? '참여 중...' : '참여하기'}
            </button>
          </div>

          <div className="text-center">
            <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-500 hover:text-gray-700"
            >
              취소
            </button>
          </div>
        </div>
      </div>
  );
}