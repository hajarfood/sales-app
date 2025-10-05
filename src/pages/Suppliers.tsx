import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import NavigationBar from "@/components/dashboard/NavigationBar";
import {
  UserCog,
  Plus,
  Building,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Link,
} from "lucide-react";
import CentralSystem, { Supplier } from "@/services/CentralSystem";

const Suppliers = () => {
  const [isNewSupplierOpen, setIsNewSupplierOpen] = useState(false);
  const [isEditSupplierOpen, setIsEditSupplierOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [centralSystem] = useState(() => CentralSystem.getInstance());
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    taxNumber: "",
    paymentTerms: "",
  });

  // Load suppliers from central system
  useEffect(() => {
    const loadSuppliers = () => {
      setSuppliers(centralSystem.getSuppliers());
    };

    loadSuppliers();
    centralSystem.addListener(loadSuppliers);

    return () => {
      centralSystem.removeListener(loadSuppliers);
    };
  }, [centralSystem]);

  const handleCreateSupplier = async () => {
    if (!formData.name.trim()) {
      alert("يرجى إدخال اسم المورد");
      return;
    }

    try {
      const supplierData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
      };

      // Only add to central system, which handles both Supabase and localStorage
      await centralSystem.addSupplier(supplierData);

      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        taxNumber: "",
        paymentTerms: "",
      });
      setIsNewSupplierOpen(false);
      alert("تم إضافة المورد بنجاح");
    } catch (error) {
      console.error("Error adding supplier:", error);
      alert("حدث خطأ أثناء إضافة المورد");
    }
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsEditSupplierOpen(true);
  };

  const handleUpdateSupplier = () => {
    if (editingSupplier) {
      centralSystem.updateSupplier(editingSupplier.id, editingSupplier);
      setEditingSupplier(null);
      setIsEditSupplierOpen(false);
    }
  };

  const handleDeleteSupplier = (id: string) => {
    if (
      confirm(
        "هل أنت متأكد من حذف هذا المورد؟ سيتم حذف الحساب المرتبط به أيضاً.",
      )
    ) {
      centralSystem.deleteSupplier(id);
    }
  };

  const handleViewSupplier = (supplier: Supplier) => {
    alert(
      `عرض المورد ${supplier.name}\nالهاتف: ${supplier.phone}\nإجمالي المشتريات: ${supplier.totalPurchases} ر.س`,
    );
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100"
      dir="rtl"
    >
      <NavigationBar />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <div className="p-3 bg-green-500 text-white rounded-lg">
              <UserCog className="h-6 w-6" />
            </div>
            إدارة الموردين
            <Link className="h-6 w-6 text-blue-500" />
          </h1>
          <p className="text-gray-600">
            إدارة بيانات الموردين ومتابعة المشتريات - مرتبط بدليل الحسابات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-500" />
                مورد جديد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog
                open={isNewSupplierOpen}
                onOpenChange={setIsNewSupplierOpen}
              >
                <DialogTrigger asChild>
                  <Button className="w-full bg-green-500 hover:bg-green-600">
                    إضافة مورد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>إضافة مورد جديد</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="supplierName">اسم المورد</Label>
                      <Input
                        placeholder="أدخل اسم المورد"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">رقم الهاتف</Label>
                        <Input
                          placeholder="+966501234567"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input
                          type="email"
                          placeholder="supplier@email.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">العنوان</Label>
                      <Textarea
                        placeholder="أدخل عنوان المورد"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="taxNumber">الرقم الضريبي</Label>
                        <Input
                          placeholder="123456789"
                          value={formData.taxNumber}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              taxNumber: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paymentTerms">شروط الدفع</Label>
                        <Input
                          placeholder="30 يوم"
                          value={formData.paymentTerms}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              paymentTerms: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsNewSupplierOpen(false)}
                    >
                      إلغاء
                    </Button>
                    <Button
                      onClick={handleCreateSupplier}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      إضافة المورد
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="h-5 w-5 text-green-500" />
                إجمالي الموردين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {suppliers.length}
              </p>
              <p className="text-sm text-gray-500">مورد نشط</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">قائمة الموردين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-right border">اسم المورد</th>
                    <th className="p-3 text-right border">رقم الهاتف</th>
                    <th className="p-3 text-right border">البريد الإلكتروني</th>
                    <th className="p-3 text-right border">إجمالي المشتريات</th>
                    <th className="p-3 text-right border">آخر طلب</th>
                    <th className="p-3 text-right border">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((supplier) => (
                    <tr key={supplier.id}>
                      <td className="p-3 border">{supplier.name}</td>
                      <td className="p-3 border">{supplier.phone}</td>
                      <td className="p-3 border">{supplier.email}</td>
                      <td className="p-3 border">
                        {supplier.totalPurchases.toFixed(2)} ر.س
                      </td>
                      <td className="p-3 border">{supplier.lastOrder}</td>
                      <td className="p-3 border">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewSupplier(supplier)}
                            className="p-2"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditSupplier(supplier)}
                            className="p-2"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteSupplier(supplier.id)}
                            className="p-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Suppliers;
