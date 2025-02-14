import { useState, useEffect } from "react";

export default function InstructorDashboard({ user }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [lectureName, setLectureName] = useState("");
    const [lectures, setLectures] = useState([]);

    const fetchLectures = async () => {
        console.log("Stored Access Token:", localStorage.getItem("accessToken"));
        try {
            const response = await fetch('/api/lectures', {
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

    const handleCreateLecture = async () => {
        try {
            const response = await fetch('/api/lectures', {
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
            }
        } catch (error) {
            console.error('Failed to create lecture:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {user.affiliation}
                        </h1>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            + 새 수업
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-6">
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">진행 중인 수업</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lectures.map(lecture => (
                            <div key={lecture.id} className="bg-white rounded-lg shadow p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-semibold">{lecture.name}</h3>
                                    <button className="text-gray-500">⋮</button>
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button className="text-gray-600 hover:text-gray-900">
                                        📑
                                    </button>
                                    <button className="text-gray-600 hover:text-gray-900">
                                        📊
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-xl font-bold mb-4">새 수업 만들기</h3>
                        <input
                            type="text"
                            placeholder="수업 이름을 입력하세요"
                            className="w-full p-2 border rounded mb-4"
                            value={lectureName}
                            onChange={(e) => setLectureName(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 text-gray-600 hover:text-gray-900"
                                onClick={() => {
                                    setIsCreateModalOpen(false);
                                    setLectureName("");
                                }}
                            >
                                취소
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                onClick={handleCreateLecture}
                            >
                                생성
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}