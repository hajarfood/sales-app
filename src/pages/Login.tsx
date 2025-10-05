import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { signIn, signUp, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setError("يرجى إدخال بريد إلكتروني صحيح");
        setLoading(false);
        return;
      }

      // Validate password length
      if (password.length < 6) {
        setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
        setLoading(false);
        return;
      }

      console.log("Attempting authentication with:", {
        email: email.trim(),
        passwordLength: password.length,
        isRegister,
      });

      const { data, error } = isRegister
        ? await signUp(email.trim(), password)
        : await signIn(email.trim(), password);

      console.log("Auth response:", { data, error, user: data?.user });

      if (error) {
        // Handle specific Supabase error messages
        let errorMessage = error.message || "حدث خطأ غير متوقع";

        if (
          error.message?.includes("Invalid login credentials") ||
          error.message?.includes("invalid_credentials") ||
          error.message?.includes("Invalid email or password")
        ) {
          errorMessage =
            "بيانات الدخول غير صحيحة. تأكد من البريد الإلكتروني وكلمة المرور";
        } else if (error.message?.includes("Email not confirmed")) {
          errorMessage =
            "يرجى تأكيد بريدك الإلكتروني أولاً. تحقق من صندوق الوارد أو البريد المزعج";
        } else if (error.message?.includes("User already registered")) {
          errorMessage =
            "هذا البريد الإلكتروني مسجل بالفعل. جرب تسجيل الدخول بدلاً من ذلك";
        } else if (error.message?.includes("Password should be at least")) {
          errorMessage = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
        } else if (
          error.message?.includes("Unable to validate email address")
        ) {
          errorMessage = "البريد الإلكتروني غير صحيح";
        } else if (error.message?.includes("Signup is disabled")) {
          errorMessage = "التسجيل معطل حالياً. يرجى المحاولة لاحقاً";
        } else if (error.message?.includes("Email rate limit exceeded")) {
          errorMessage = "تم تجاوز حد إرسال الرسائل. يرجى المحاولة بعد قليل";
        } else if (error.message?.includes("User not found")) {
          errorMessage = "لم يتم العثور على حساب بهذا البريد الإلكتروني";
        } else if (error.message?.includes("Too many requests")) {
          errorMessage =
            "تم تجاوز عدد المحاولات المسموح. يرجى المحاولة بعد قليل";
        }

        console.error("Login error:", errorMessage);
        setError(errorMessage);
      } else if (isRegister) {
        setError("");
        if (data?.user) {
          if (!data.user.email_confirmed_at) {
            alert(
              "تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب قبل تسجيل الدخول.",
            );
            setIsRegister(false); // Switch back to login mode
          } else {
            // Account created and confirmed automatically
            console.log("Account created and confirmed automatically");
          }
        }
      } else {
        // Successful login
        console.log("Login successful", data?.user);
        setError("");
      }
    } catch (err) {
      console.error("Login exception:", err);
      setError("حدث خطأ غير متوقع في الاتصال");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await resetPassword(email);
      if (error) {
        let errorMessage = error.message;
        if (error.message.includes("User not found")) {
          errorMessage = "لم يتم العثور على حساب بهذا البريد الإلكتروني";
        }
        setError(errorMessage);
      } else {
        alert("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
        setShowForgotPassword(false);
      }
    } catch (err) {
      setError("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50 p-4"
        dir="rtl"
      >
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              إعادة تعيين كلمة المرور
            </CardTitle>
            <CardDescription>
              أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-right"
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setShowForgotPassword(false)}
              >
                العودة لتسجيل الدخول
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 p-4"
      dir="rtl"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isRegister ? "إنشاء حساب جديد" : "تسجيل الدخول"}
          </CardTitle>
          <CardDescription>
            {isRegister
              ? "أدخل بياناتك لإنشاء حساب جديد"
              : "أدخل بياناتك للوصول إلى حسابك"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-right"
                placeholder="أدخل بريدك الإلكتروني"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-right pr-10"
                  placeholder="أدخل كلمة المرور"
                />
                <button
                  type="button"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "جاري المعالجة..."
                : isRegister
                  ? "إنشاء حساب"
                  : "تسجيل الدخول"}
            </Button>

            {!isRegister && (
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setShowForgotPassword(true)}
              >
                نسيت كلمة المرور؟
              </Button>
            )}

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                }}
              >
                {isRegister
                  ? "لديك حساب بالفعل؟ سجل الدخول"
                  : "ليس لديك حساب؟ أنشئ حساباً جديداً"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
