import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function InstructorDashboard({ user }) {
    const navigate = useNavigate();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [lectureName, setLectureName] = useState("");
    const [lectures, setLectures] = useState([]);

    const fetchLectures = async () => {
        try {
            const response = await fetch('/api/instructor/lectures', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            if (response.ok) {
                const data = await response.json();
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

    const handleCreateLecture = async () => {
        try {
            const response = await fetch('/api/instructor/lectures', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify({ name: lectureName })
            });

            if (response.ok) {
                setIsCreateModalOpen(false);
                setLectureName("");
                fetchLectures();
            } else {
                console.error('Failed to create lecture:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Failed to create lecture:', error);
        }
    };

    const LectureCard = ({ lecture }) => (
        <div
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/dashboard/${lecture.id}?code=${lecture.code}`)}
        >
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{lecture.name}</h3>
                <button
                    className="text-gray-500"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    ⋮
                </button>
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
                        navigate(`/dashboard/${lecture.id}?code=${lecture.code}&tab=grades`);
                    }}
                >
                    📊
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
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {user.affiliation}
                        </h2>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                + 새 수업
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
        </div>
    );
}