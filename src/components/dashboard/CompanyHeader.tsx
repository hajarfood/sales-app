import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Database, LogOut, Building } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface CompanyHeaderProps {
  companyName?: string;
  taxNumber?: string;
  logoUrl?: string;
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
  onRestoreData?: () => void;
}

const CompanyHeader = ({
  companyName = "اسم المؤسسة",
  taxNumber = "غير محدد",
  logoUrl,
  userName = "المدير",
  userRole = "مدير",
  onLogout,
  onRestoreData,
}: CompanyHeaderProps) => {
  const { signOut } = useAuth();
  // Load company settings from localStorage
  const [companySettings, setCompanySettings] = React.useState({
    name: companyName,
    taxNumber: taxNumber,
    logo: logoUrl,
  });

  React.useEffect(() => {
    const savedSettings = localStorage.getItem("company_settings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setCompanySettings({
        name: settings.name || companyName,
        taxNumber: settings.taxNumber || taxNumber,
        logo: settings.logo || logoUrl,
      });
    }
  }, [companyName, taxNumber, logoUrl]);
  // Handle logout
  const handleLogout = async () => {
    try {
      if (onLogout) {
        onLogout();
      } else {
        await signOut();
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Handle restore data
  const handleRestoreData = () => {
    try {
      if (onRestoreData) {
        onRestoreData();
      } else {
        // Clear all localStorage data and reload
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          if (
            key.startsWith("inventory_") ||
            key.startsWith("customers") ||
            key.startsWith("suppliers") ||
            key.startsWith("invoices") ||
            key.startsWith("purchases") ||
            key.startsWith("journal_entries") ||
            key.startsWith("centralSystem_")
          ) {
            localStorage.removeItem(key);
          }
        });
        alert("تم مسح جميع البيانات بنجاح. سيتم إعادة تحميل الصفحة.");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error during data restore:", error);
      alert("حدث خطأ أثناء استعادة البيانات");
    }
  };

  // تحويل دور المستخدم إلى العربية
  const getRoleInArabic = (role: string): string => {
    const roleMap: Record<string, string> = {
      admin: "مدير",
      manager: "مدير فرع",
      accountant: "محاسب",
      cashier: "كاشير",
      seller: "بائع",
    };

    return roleMap[role] || role;
  };

  return (
    <div className="bg-white rounded-xl p-5 mb-5 shadow-md flex justify-between items-center flex-col md:flex-row gap-4 md:gap-0">
      <div className="flex items-center gap-4">
        <div className="w-[60px] h-[60px] rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-600 text-white">
          {companySettings.logo ? (
            <img
              src={companySettings.logo}
              alt="شعار المؤسسة"
              className="w-full h-full object-cover"
            />
          ) : (
            <Building size={24} />
          )}
        </div>
        <div className="text-center md:text-right">
          <h1 className="text-2xl font-bold text-gray-800 m-0">
            {companySettings.name}
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            الرقم الضريبي: {companySettings.taxNumber}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`}
              alt={userName}
            />
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-gray-800">
            مرحباً، {userName} ({getRoleInArabic(userRole)})
          </span>
        </div>

        <Button
          variant="default"
          className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 transition-transform hover:-translate-y-0.5"
          onClick={handleRestoreData}
        >
          <Database className="ml-2 h-4 w-4" />
          استعادة البيانات
        </Button>

        <Button
          variant="destructive"
          className="transition-transform hover:-translate-y-0.5"
          onClick={handleLogout}
        >
          <LogOut className="ml-2 h-4 w-4" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  );
};

export default CompanyHeader;
