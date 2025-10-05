import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import CompanyHeader from "@/components/dashboard/CompanyHeader";
import NavigationBar from "@/components/dashboard/NavigationBar";
import QuickReports from "@/components/dashboard/QuickReports";
import { Button } from "@/components/ui/button";
import {
  FileTextIcon,
  PackageIcon,
  UserPlusIcon,
  Receipt,
  SettingsIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "reports":
        navigate("/reports");
        break;
      case "new-product":
        navigate("/inventory");
        break;
      case "new-customer":
        navigate("/customers");
        break;
      case "new-invoice":
        navigate("/sales");
        break;
      case "settings":
        navigate("/settings");
        break;
      default:
        break;
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100"
      dir="rtl"
    >
      <NavigationBar />
      <main className="container mx-auto px-4 py-6">
        <CompanyHeader />

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="p-2 bg-primary/10 rounded-md">
              <FileTextIcon className="h-5 w-5" />
            </span>
            لوحة التحكم
          </h2>
        </div>

        {/* الإجراءات السريعة */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-primary">⚡</span> إجراءات سريعة
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2 p-4 hover:bg-blue-50 border-blue-200"
                onClick={() => handleQuickAction("reports")}
              >
                <FileTextIcon className="h-6 w-6 text-blue-500" />
                <span>التقارير</span>
              </Button>

              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2 p-4 hover:bg-green-50 border-green-200"
                onClick={() => handleQuickAction("new-product")}
              >
                <PackageIcon className="h-6 w-6 text-green-500" />
                <span>منتج جديد</span>
              </Button>

              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2 p-4 hover:bg-purple-50 border-purple-200"
                onClick={() => handleQuickAction("new-customer")}
              >
                <UserPlusIcon className="h-6 w-6 text-purple-500" />
                <span>عميل جديد</span>
              </Button>

              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2 p-4 hover:bg-orange-50 border-orange-200"
                onClick={() => handleQuickAction("new-invoice")}
              >
                <Receipt className="h-6 w-6 text-orange-500" />
                <span>فاتورة جديدة</span>
              </Button>

              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2 p-4 hover:bg-gray-50 border-gray-200"
                onClick={() => handleQuickAction("settings")}
              >
                <SettingsIcon className="h-6 w-6 text-gray-500" />
                <span>الإعدادات</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* تقارير سريعة */}
        <QuickReports />

        {/* منطقة عرض التقارير المباشرة */}
        <div id="direct-report-container" className="hidden">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 id="report-title" className="text-xl font-semibold">
                  تقرير
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    document
                      .getElementById("direct-report-container")
                      ?.classList.add("hidden");
                  }}
                >
                  <span className="sr-only">إغلاق</span>×
                </Button>
              </div>

              <div id="report-content" className="mt-4">
                {/* محتوى التقرير سيظهر هنا */}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="bg-white border-t py-6 text-center">
        <div className="container mx-auto">
          <p className="text-gray-500">
            جميع الحقوق محفوظة ©{new Date().getFullYear()}- نظام إدارة الأعمال
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
