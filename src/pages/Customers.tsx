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
  Users,
  Plus,
  UserCheck,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Link,
} from "lucide-react";
import CentralSystem, { Customer } from "@/services/CentralSystem";

const Customers = () => {
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [centralSystem] = useState(() => CentralSystem.getInstance());
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    taxNumber: "",
    creditLimit: 0,
  });

  // Load customers from central system
  useEffect(() => {
    const loadCustomers = () => {
      setCustomers(centralSystem.getCustomers());
    };

    loadCustomers();
    centralSystem.addListener(loadCustomers);

    return () => {
      centralSystem.removeListener(loadCustomers);
    };
  }, [centralSystem]);

  const handleCreateCustomer = async () => {
    if (!formData.name.trim()) {
      alert("يرجى إدخال اسم العميل");
      return;
    }

    try {
      const customerData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
      };

      // Only add to central system, which handles both Supabase and localStorage
      await centralSystem.addCustomer(customerData);

      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        taxNumber: "",
        creditLimit: 0,
      });
      setIsNewCustomerOpen(false);
      alert("تم إضافة العميل بنجاح");
    } catch (error) {
      console.error("Error adding customer:", error);
      alert("حدث خطأ أثناء إضافة العميل");
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsEditCustomerOpen(true);
  };

  const handleUpdateCustomer = () => {
    if (editingCustomer) {
      centralSystem.updateCustomer(editingCustomer.id, editingCustomer);
      setEditingCustomer(null);
      setIsEditCustomerOpen(false);
    }
  };

  const handleDeleteCustomer = (id: string) => {
    if (
      confirm(
        "هل أنت متأكد من حذف هذا العميل؟ سيتم حذف الحساب المرتبط به أيضاً.",
      )
    ) {
      centralSystem.deleteCustomer(id);
    }
  };

  const handleViewCustomer = (customer: Customer) => {
    alert(
      `عرض العميل ${customer.name}\nالهاتف: ${customer.phone}\nإجمالي المشتريات: ${customer.totalPurchases} ر.س`,
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
              <Users className="h-6 w-6" />
            </div>
            إدارة العملاء
            <Link className="h-6 w-6 text-blue-500" />
          </h1>
          <p className="text-gray-600">
            إدارة بيانات العملاء ومتابعة المبيعات - مرتبط بدليل الحسابات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-500" />
                عميل جديد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog
                open={isNewCustomerOpen}
                onOpenChange={setIsNewCustomerOpen}
              >
                <DialogTrigger asChild>
                  <Button className="w-full bg-green-500 hover:bg-green-600">
                    إضافة عميل
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>إضافة عميل جديد</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">اسم العميل</Label>
                      <Input
                        placeholder="أدخل اسم العميل"
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
                          placeholder="customer@email.com"
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
                        placeholder="أدخل عنوان العميل"
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
                        <Label htmlFor="creditLimit">الحد الائتماني</Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          step="0.01"
                          value={formData.creditLimit}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              creditLimit: parseFloat(e.target.value) || 0,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsNewCustomerOpen(false)}
                    >
                      إلغاء
                    </Button>
                    <Button
                      onClick={handleCreateCustomer}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      إضافة العميل
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                إجمالي العملاء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {customers.length}
              </p>
              <p className="text-sm text-gray-500">عميل نشط</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">قائمة العملاء</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-right border">اسم العميل</th>
                    <th className="p-3 text-right border">رقم الهاتف</th>
                    <th className="p-3 text-right border">البريد الإلكتروني</th>
                    <th className="p-3 text-right border">إجمالي المشتريات</th>
                    <th className="p-3 text-right border">آخر زيارة</th>
                    <th className="p-3 text-right border">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="p-3 border">{customer.name}</td>
                      <td className="p-3 border">{customer.phone}</td>
                      <td className="p-3 border">{customer.email}</td>
                      <td className="p-3 border">
                        {customer.totalPurchases.toFixed(2)} ر.س
                      </td>
                      <td className="p-3 border">{customer.lastVisit}</td>
                      <td className="p-3 border">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewCustomer(customer)}
                            className="p-2"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditCustomer(customer)}
                            className="p-2"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteCustomer(customer.id)}
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

        {/* Edit Customer Dialog */}
        <Dialog open={isEditCustomerOpen} onOpenChange={setIsEditCustomerOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تعديل العميل</DialogTitle>
            </DialogHeader>
            {editingCustomer && (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="editName">اسم العميل</Label>
                  <Input
                    value={editingCustomer.name}
                    onChange={(e) =>
                      setEditingCustomer((prev) =>
                        prev ? { ...prev, name: e.target.value } : null,
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editPhone">رقم الهاتف</Label>
                    <Input
                      value={editingCustomer.phone}
                      onChange={(e) =>
                        setEditingCustomer((prev) =>
                          prev ? { ...prev, phone: e.target.value } : null,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editEmail">البريد الإلكتروني</Label>
                    <Input
                      type="email"
                      value={editingCustomer.email}
                      onChange={(e) =>
                        setEditingCustomer((prev) =>
                          prev ? { ...prev, email: e.target.value } : null,
                        )
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editTotalPurchases">إجمالي المشتريات</Label>
                    <Input
                      type="number"
                      value={editingCustomer.totalPurchases}
                      onChange={(e) =>
                        setEditingCustomer((prev) =>
                          prev
                            ? {
                                ...prev,
                                totalPurchases: parseFloat(e.target.value) || 0,
                              }
                            : null,
                        )
                      }
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editLastVisit">آخر زيارة</Label>
                    <Input
                      type="date"
                      value={editingCustomer.lastVisit}
                      onChange={(e) =>
                        setEditingCustomer((prev) =>
                          prev ? { ...prev, lastVisit: e.target.value } : null,
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditCustomerOpen(false)}
              >
                إلغاء
              </Button>
              <Button
                onClick={handleUpdateCustomer}
                className="bg-green-500 hover:bg-green-600"
              >
                حفظ التغييرات
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Customers;
