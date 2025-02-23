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
            const response = await fetch('/api/student/lectures', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("받은 강의 목록: ", data);
                setLectures(data);
            } else {
                console.error('Failed to fetch lectures:', response.status, response.statusText);
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
            const response = await fetch('/api/student/lectures/join', {
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
            } else {
                console.error('Failed to join lecture:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Failed to join lecture:', error);
        }
    };

    const LectureCard = ({ lecture }) => (
        <div
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/dashboard/${lecture.id}?code=${lecture.code}`)}
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
                        navigate(`/dashboard/${lecture.id}?code=${lecture.code}&tab=announcements`);
                    }}
                >
                    📑
                </button>
                <button
                    className="text-gray-600 hover:text-gray-900"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/${lecture.id}?code=${lecture.code}&tab=chat`);
                    }}
                >
                    💬
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-100">
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
                                    onClick={() => navigate(`/dashboard/${lecture.id}?code=${lecture.code}`)}
                                >
                                    {lecture.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </nav>
            </div>

            <div className="flex-1">
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
        </div>
    );
}