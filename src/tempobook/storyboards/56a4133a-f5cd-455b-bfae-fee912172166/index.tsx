import { AuthProvider } from "@/contexts/AuthContext";
import Login from "@/pages/Login";

export default function LoginTestStoryboard() {
  return (
    <AuthProvider>
      <div className="bg-gray-50 min-h-screen">
        <div className="p-4 bg-blue-100 text-center text-sm">
          <p className="font-bold">حسابات التجربة:</p>
          <p>test@example.com - كلمة المرور: 123456</p>
          <p>admin@example.com - كلمة المرور: 123456</p>
        </div>
        <Login />
      </div>
    </AuthProvider>
  );
}
