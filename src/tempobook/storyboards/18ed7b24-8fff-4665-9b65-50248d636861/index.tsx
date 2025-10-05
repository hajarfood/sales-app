import Login from "@/pages/Login";
import { AuthProvider } from "@/contexts/AuthContext";

export default function AuthTestStoryboard() {
  return (
    <AuthProvider>
      <div className="bg-gray-50 min-h-screen">
        <Login />
      </div>
    </AuthProvider>
  );
}
