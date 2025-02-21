import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
    const [tab, setTab] = useState("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [message, setMessage] = useState("");
    const [pendingApproval, setPendingApproval] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const returnTo = new URLSearchParams(location.search).get('return_to');

    const requestEmailVerification = async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/auth/email-verification?email=${email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                alert("이메일 인증 요청이 전송되었습니다.");
            } else {
                alert("이메일 인증 요청 실패! 다시 시도해주세요.");
            }
        } catch (error) {
            console.error("이메일 인증 요청 실패:", error);
            alert("서버 오류 발생! 다시 시도해주세요.");
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await fetch(`http://localhost:8080/api/auth/${tab}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem("accessToken", result.accessToken);
                localStorage.setItem("role", result.role);
                localStorage.setItem("email", result.email);
                localStorage.setItem("name", result.name);
                localStorage.setItem("affiliation", result.affiliation || "");
                localStorage.setItem("phone", result.phone);
                localStorage.setItem("activate", result.activate);

                if (!result.activate) {
                    setPendingApproval(true);
                    if (result.role === "instructor") {
                        setMessage("관리자 승인 대기 중입니다. 승인 후 로그인 가능합니다.");
                    } else {
                        setMessage("이메일 인증이 필요합니다.");
                    }
                } else {
                    if (returnTo) {
                        navigate(returnTo);
                    } else {
                        navigate("/dashboard");
                    }
                }
            } else {
                setMessage("로그인 실패! 이메일 또는 비밀번호를 확인하세요.");
            }
        } catch (error) {
            console.error("로그인 요청 실패:", error);
            setMessage("서버 오류 발생! 다시 시도해주세요.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
                <h1 className="text-4xl font-bold text-center mb-6">
                    <span className="text-gray-900">Gathe</span>
                    <span className="text-blue-600">ria</span>
                </h1>

                <div className="flex bg-gray-200 rounded-lg p-1 mb-6">
                    <button
                        className={`flex-1 text-center p-2 rounded-md transition ${
                            tab === "instructor" ? "bg-white font-bold shadow-md" : "text-gray-500 hover:bg-gray-300"
                        }`}
                        onClick={() => setTab("instructor")}
                    >
                        교수자
                    </button>
                    <button
                        className={`flex-1 text-center p-2 rounded-md transition ${
                            tab === "student" ? "bg-white font-bold shadow-md" : "text-gray-500 hover:bg-gray-300"
                        }`}
                        onClick={() => setTab("student")}
                    >
                        학생
                    </button>
                </div>

                {message && <p className="text-center text-red-500 mb-4">{message}</p>}

                <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-medium">이메일 (아이디)</label>
                        <Input
                            type="email"
                            placeholder="이메일 입력"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">비밀번호</label>
                        <Input
                            type="password"
                            placeholder="비밀번호 입력"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                            className="mr-2"
                        />
                        <label htmlFor="rememberMe" className="text-sm text-gray-700">
                            자동 로그인
                        </label>
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                        로그인
                    </Button>
                </form>

                <div className="mt-4 flex justify-center text-sm text-gray-600 space-x-4">
                    <button onClick={() => navigate("/register")} className="hover:underline">
                        회원가입
                    </button>
                    <span>|</span>
                    <button className="hover:underline">이메일 찾기</button>
                    <span>|</span>
                    <button className="hover:underline">비밀번호 찾기</button>
                </div>

                {pendingApproval && tab === "student" && (
                    <div className="mt-6 text-center">
                        <Button onClick={requestEmailVerification} className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600">
                            이메일 인증 요청
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}