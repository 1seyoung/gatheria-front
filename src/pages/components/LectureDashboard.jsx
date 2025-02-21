import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function LectureDashboard() {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    const fetchLectureDetails = async () => {
      try {
        const response = await fetch(`/api/lectures/${identifier}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setLecture(data);
        } else {
          console.error('Failed to fetch lecture details:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch lecture details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLectureDetails();
  }, [identifier]);

  const handleCopy = async (text, message) => {
    try {
      await navigator.clipboard.writeText(text);
      setToastMessage(message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">로딩 중...</div>
    </div>;
  }

  return (
      <div className="min-h-screen bg-gray-100">
        {/* Header with lecture name and navigation */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center mb-2">
              <button
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-600 hover:text-gray-900 mr-4"
              >
                ← 돌아가기
              </button>
              <div className="text-gray-500">
                <span className="mx-2">/</span>
                <span>{lecture?.name}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">{lecture?.name}</h1>
                <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-md">
                  <span className="text-sm text-gray-500">초대 코드:</span>
                  <span className="font-mono text-sm">{lecture?.code}</span>
                  <button
                      onClick={() => handleCopy(lecture?.code, "초대 코드가 복사되었습니다.")}
                      className="p-1 hover:bg-gray-200 rounded"
                  >
                    📋
                  </button>
                </div>
              </div>
              <div className="relative">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-gray-500 hover:text-gray-700 p-2"
                >
                  ⋮
                </button>

                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <button
                          onClick={() => {
                            const inviteLink = `${window.location.origin}/join/${lecture?.code}`;
                            handleCopy(inviteLink, "초대 링크가 복사되었습니다.");
                            setIsMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        🔗 초대 링크 복사
                      </button>
                      <button
                          onClick={() => {
                            handleCopy(lecture?.code, "초대 코드가 복사되었습니다.");
                            setIsMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        📋 초대 코드 복사
                      </button>
                    </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="-mb-px flex space-x-8">
              <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'overview'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                게시판
              </button>
              <button
                  onClick={() => setActiveTab('assignments')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'assignments'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                과제
              </button>
              <button
                  onClick={() => setActiveTab('students')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'students'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                수강생
              </button>
              <button
                  onClick={() => setActiveTab('grades')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'grades'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                성적
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Announcements Section */}
                <section>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">공지사항</h2>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      + 새 공지
                    </button>
                  </div>
                  <div className="bg-white shadow rounded-lg p-6">
                    <p className="text-gray-500 text-center py-4">아직 등록된 공지사항이 없습니다.</p>
                  </div>
                </section>

                {/* Assignments Section */}
                <section>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">진행 중인 과제</h2>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      + 새 과제
                    </button>
                  </div>
                  <div className="bg-white shadow rounded-lg p-6">
                    <p className="text-gray-500 text-center py-4">아직 등록된 과제가 없습니다.</p>
                  </div>
                </section>
              </div>
          )}

          {activeTab === 'assignments' && (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">전체 과제</h2>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    + 새 과제
                  </button>
                </div>
                <p className="text-gray-500 text-center py-4">아직 등록된 과제가 없습니다.</p>
              </div>
          )}

          {activeTab === 'students' && (
              <div className="space-y-6">
                {/* 교수자 정보 섹션 */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">교수자</h3>
                  <div className="flex items-center space-x-3 p-2">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                      👤
                    </div>
                    <div>
                      <div className="font-medium">{lecture?.instructor?.name}</div>
                      <div className="text-sm text-gray-500">{lecture?.instructor?.email}</div>
                    </div>
                  </div>
                </div>

                {/* 수강생 목록 섹션 */}
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">수강생 목록</h3>
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      + 학생 추가
                    </button>
                  </div>

                  {/* 수강생 목록 */}
                  <div className="space-y-3">
                    {lecture?.students?.length > 0 ? (
                        lecture.students.map(student => (
                            <div key={student.id} className="flex items-center justify-between p-2 hover:bg-gray-50">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                  👤
                                </div>
                                <div>
                                  <div className="font-medium">{student.name}</div>
                                  <div className="text-sm text-gray-500">{student.email}</div>
                                </div>
                              </div>
                              <button className="text-gray-400 hover:text-gray-600">⋮</button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">아직 등록된 수강생이 없습니다.</p>
                    )}
                  </div>
                </div>
              </div>
          )}

          {activeTab === 'grades' && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">성적 관리</h2>
                <p className="text-gray-500 text-center py-4">아직 등록된 성적이 없습니다.</p>
              </div>
          )}
        </main>

        {/* Toast Message */}
        {showToast && (
            <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg">
              {toastMessage}
            </div>
        )}

        {/* 초대 모달 */}
        {showInviteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-[500px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">학생 초대</h3>
                  <button
                      onClick={() => setShowInviteModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-4">
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                    <span>초대 링크:</span>
                    <span className="flex-1 text-gray-600">
                 {`${window.location.origin}/join/${lecture?.code}`}
               </span>
                    <button
                        onClick={() => {
                          const inviteLink = `${window.location.origin}/join/${lecture?.code}`;
                          handleCopy(inviteLink, "초대 링크가 복사되었습니다.");
                        }}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      복사
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                      onClick={() => setShowInviteModal(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}