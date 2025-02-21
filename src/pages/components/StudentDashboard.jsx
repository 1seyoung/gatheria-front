import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard({ user }) {
    const navigate = useNavigate();
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [joinCode, setJoinCode] = useState("");
    const [lectures, setLectures] = useState([]);
    const [organizations, setOrganizations] = useState(['Eureka']);
    const [selectedOrg, setSelectedOrg] = useState('Eureka');

    const fetchLectures = async () => {
        try {
            const response = await fetch('/api/lectures/enrolled', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setLectures(data);
            }
        } catch (error) {
            console.error('Failed to fetch lectures:', error);
        }
    };

    useEffect(() => {
        fetchLectures();
    }, []);

    const handleJoinLecture = async () => {
        try {
            const response = await fetch('/api/lectures/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify({ code: joinCode })
            });

            if (response.ok) {
                setIsJoinModalOpen(false);
                setJoinCode("");
                fetchLectures();
            }
        } catch (error) {
            console.error('Failed to join lecture:', error);
        }
    };

    const LectureCard = ({ lecture }) => (
        <div
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/dashboard/${lecture.code}-${lecture.id}`)}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-semibold">{lecture.name}</h3>
                    <p className="text-sm text-gray-500">{lecture.instructor?.name}</p>
                </div>
                {lecture.hasNewNotice && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">New</span>
                )}
            </div>
            <div className="flex justify-end space-x-4">
                <button
                    className="text-gray-600 hover:text-gray-900"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/${lecture.code}-${lecture.id}?tab=announcements`);
                    }}
                >
                    📑
                </button>
                <button
                    className="text-gray-600 hover:text-gray-900"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/${lecture.code}-${lecture.id}?tab=chat`);
                    }}
                >
                    💬
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg">
                <div className="p-4">
                    <h1 className="text-xl font-bold text-left">Gatheria</h1>
                </div>
                <nav className="mt-4">
                    <div className="px-4 py-2">
                        <h2 className="text-lg font-bold text-gray-800 text-left mb-4">소속</h2>
                        <div className="mt-2 space-y-1">
                            {organizations.map(org => (
                                <div
                                    key={org}
                                    className={`px-3 py-2 text-sm rounded cursor-pointer ${
                                        selectedOrg === org
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'hover:bg-gray-100'
                                    }`}
                                    onClick={() => setSelectedOrg(org)}
                                >
                                    {org}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="px-4 py-2">
                        <h2 className="text-lg font-bold text-gray-800 text-left mb-4">강의 목록</h2>
                        <div className="mt-2 space-y-1">
                            {lectures.map(lecture => (
                                <div
                                    key={lecture.id}
                                    className="px-3 py-2 text-sm hover:bg-gray-100 rounded cursor-pointer border-l-4 border-transparent hover:border-blue-500"
                                    onClick={() => navigate(`/dashboard/${lecture.code}-${lecture.id}`)}
                                >
                                    {lecture.name}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="px-4 py-2 mt-4">
                        <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
                            📦 <span>완료된 수업</span>
                        </button>
                        <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 mt-2">
                            ⚙️ <span>설정</span>
                        </button>
                    </div>
                </nav>
            </div>

            {/* Main content */}
            <div className="flex-1">
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {selectedOrg}
                        </h2>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsJoinModalOpen(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                + 수업 참여하기
                            </button>
                            <button
                                onClick={() => setIsUserModalOpen(true)}
                                className="p-2 text-gray-600 hover:text-gray-900"
                            >
                                👤
                            </button>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 py-6">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">진행 중인 수업</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {lectures.map(lecture => (
                                <LectureCard key={lecture.id} lecture={lecture} />
                            ))}
                        </div>
                    </section>
                </main>
            </div>

            {/* Join Lecture Modal */}
            {isJoinModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-xl font-bold mb-4">수업 참여하기</h3>
                        <input
                            type="text"
                            placeholder="초대 코드를 입력하세요"
                            className="w-full p-2 border rounded mb-4"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 text-gray-600 hover:text-gray-900"
                                onClick={() => {
                                    setIsJoinModalOpen(false);
                                    setJoinCode("");
                                }}
                            >
                                취소
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                onClick={handleJoinLecture}
                            >
                                참여하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* User Info Modal */}
            {isUserModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-xl font-bold mb-4">사용자 정보</h3>
                        <div className="space-y-2">
                            <p><strong>이름:</strong> {user.name}</p>
                            <p><strong>이메일:</strong> {user.email}</p>
                            <p><strong>전화번호:</strong> {user.phone}</p>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                className="px-4 py-2 text-gray-600 hover:text-gray-900"
                                onClick={() => setIsUserModalOpen(false)}
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