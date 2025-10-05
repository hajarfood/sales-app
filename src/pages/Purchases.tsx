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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NavigationBar from "@/components/dashboard/NavigationBar";
import {
  Truck,
  Plus,
  FileText,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

interface Purchase {
  id: string;
  supplier: string;
  date: string;
  amount: number;
  status: string;
  items: PurchaseItem[];
}

interface PurchaseItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  tax?: number;
}

const Purchases = () => {
  const [isNewPurchaseOpen, setIsNewPurchaseOpen] = useState(false);
  const [isEditPurchaseOpen, setIsEditPurchaseOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [formData, setFormData] = useState({
    supplier: "",
    date: new Date().toISOString().split("T")[0],
    items: [] as PurchaseItem[],
    taxRate: 15, // Default VAT rate 15%
  });

  const [currentItem, setCurrentItem] = useState({
    productId: "",
    productName: "",
    quantity: 1,
    price: 0,
    total: 0,
    tax: 0,
  });

  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  // Load suppliers and products
  useEffect(() => {
    const loadSuppliersAndProducts = () => {
      const savedSuppliers = localStorage.getItem("suppliers");
      if (savedSuppliers) {
        setSuppliers(JSON.parse(savedSuppliers));
      }

      const savedProducts = localStorage.getItem("inventory_products");
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
    };

    loadSuppliersAndProducts();

    // Listen for storage changes to update products in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "inventory_products" || e.key === "suppliers") {
        loadSuppliersAndProducts();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also check for updates periodically
    const interval = setInterval(loadSuppliersAndProducts, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Load purchases from localStorage on component mount
  useEffect(() => {
    const savedPurchases = localStorage.getItem("purchases");
    if (savedPurchases) {
      setPurchases(JSON.parse(savedPurchases));
    } else {
      // Initialize with sample data
      const initialPurchases: Purchase[] = [
        {
          id: "#P001",
          supplier: "شركة التوريد المتقدمة",
          date: "2023-06-15",
          amount: 5400.0,
          status: "مستلم",
          items: [],
        },
        {
          id: "#P002",
          supplier: "مؤسسة الجودة",
          date: "2023-06-16",
          amount: 3200.0,
          status: "قيد التنفيذ",
          items: [],
        },
      ];
      setPurchases(initialPurchases);
      localStorage.setItem("purchases", JSON.stringify(initialPurchases));
    }
  }, []);

  // Save purchases to localStorage whenever purchases change
  useEffect(() => {
    if (purchases.length > 0) {
      localStorage.setItem("purchases", JSON.stringify(purchases));
    }
  }, [purchases]);

  const handleCreatePurchase = () => {
    if (formData.items.length === 0) {
      alert("يجب إضافة منتج واحد على الأقل");
      return;
    }

    // Generate automatic purchase number
    const existingPurchases = JSON.parse(
      localStorage.getItem("purchases") || "[]",
    );
    const purchaseCount = existingPurchases.length + 1;
    const purchaseNumber = `PUR-${new Date().getFullYear()}-${String(purchaseCount).padStart(4, "0")}`;
    const totalAmount = formData.items.reduce(
      (sum, item) => sum + item.total,
      0,
    );

    const newPurchase: Purchase = {
      id: purchaseNumber,
      supplier: formData.supplier || "مورد جديد",
      date: formData.date,
      amount: totalAmount,
      status: "جديد",
      items: formData.items,
    };

    // Save to localStorage immediately
    const updatedPurchases = [newPurchase, ...existingPurchases];
    setPurchases(updatedPurchases);
    localStorage.setItem("purchases", JSON.stringify(updatedPurchases));

    // Force a storage event to sync across tabs
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "purchases",
        newValue: JSON.stringify(updatedPurchases),
      }),
    );

    setFormData({
      supplier: "",
      date: new Date().toISOString().split("T")[0],
      items: [],
      taxRate: 15,
    });
    setCurrentItem({
      productId: "",
      productName: "",
      quantity: 1,
      price: 0,
      total: 0,
      tax: 0,
    });
    setIsNewPurchaseOpen(false);
    alert(`تم إنشاء فاتورة المشتريات بنجاح برقم: ${purchaseNumber}`);
  };

  const handleEditPurchase = (purchase: Purchase) => {
    setEditingPurchase(purchase);
    setIsEditPurchaseOpen(true);
  };

  const handleUpdatePurchase = () => {
    if (editingPurchase) {
      const updatedPurchases = purchases.map((purch) =>
        purch.id === editingPurchase.id ? editingPurchase : purch,
      );
      setPurchases(updatedPurchases);
      localStorage.setItem("purchases", JSON.stringify(updatedPurchases));
      setEditingPurchase(null);
      setIsEditPurchaseOpen(false);
    }
  };

  const handleDeletePurchase = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
      const updatedPurchases = purchases.filter((purch) => purch.id !== id);
      setPurchases(updatedPurchases);
      localStorage.setItem("purchases", JSON.stringify(updatedPurchases));
    }
  };

  const handleViewPurchase = (purchase: Purchase) => {
    alert(
      `عرض الطلب ${purchase.id}\nالمورد: ${purchase.supplier}\nالمبلغ: ${purchase.amount} ر.س`,
    );
  };

  const handlePrintPurchase = (purchase: Purchase) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const companySettings = JSON.parse(
        localStorage.getItem("company_settings") || "{}",
      );

      const itemsRows =
        purchase.items && purchase.items.length > 0
          ? purchase.items
              .map(
                (item) => `
            <tr>
              <td>${item.productName}</td>
              <td>${item.quantity}</td>
              <td>${item.price.toFixed(2)} ر.س</td>
              <td>${item.total.toFixed(2)} ر.س</td>
            </tr>
          `,
              )
              .join("")
          : `<tr><td colspan="4">لا توجد منتجات</td></tr>`;

      printWindow.document.write(`
        <html>
          <head>
            <title>فاتورة مشتريات - ${purchase.id}</title>
            <style>
              body { font-family: Arial, sans-serif; direction: rtl; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .company-info { margin-bottom: 20px; }
              .purchase-details { margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
              th { background-color: #f2f2f2; }
              .total { font-weight: bold; font-size: 18px; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>فاتورة مشتريات</h1>
              <h2>${companySettings.name || "اسم الشركة"}</h2>
              <p>الرقم الضريبي: ${companySettings.taxNumber || "غير محدد"}</p>
            </div>
            <div class="purchase-details">
              <p><strong>رقم الطلب:</strong> ${purchase.id}</p>
              <p><strong>التاريخ:</strong> ${purchase.date}</p>
              <p><strong>المورد:</strong> ${purchase.supplier}</p>
              <p><strong>الحالة:</strong> ${purchase.status}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>الوصف</th>
                  <th>الكمية</th>
                  <th>السعر</th>
                  <th>الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>
            <div class="total">
              <p>الإجمالي: ${purchase.amount.toFixed(2)} ر.س</p>
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleExportPDF = (purchase: Purchase) => {
    alert(`تصدير الطلب ${purchase.id} إلى PDF - سيتم تطبيق هذه الوظيفة لاحقاً`);
  };

  const handleExportExcel = (purchase: Purchase) => {
    alert(
      `تصدير الطلب ${purchase.id} إلى Excel - سيتم تطبيق هذه الوظيفة لاحقاً`,
    );
  };

  const handleProductSelect = (productName: string) => {
    const selectedProduct = products.find((p) => p.name === productName);
    if (selectedProduct) {
      const price = selectedProduct.purchasePrice || selectedProduct.salePrice;
      const subtotal = price;
      const tax = (subtotal * formData.taxRate) / 100;
      const total = subtotal + tax;
      setCurrentItem({
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity: 1,
        price: price,
        total: total,
        tax: tax,
      });
    }
  };

  const updateCurrentItemTotal = () => {
    const subtotal = currentItem.quantity * currentItem.price;
    const tax = (subtotal * formData.taxRate) / 100;
    const total = subtotal + tax;
    setCurrentItem((prev) => ({ ...prev, total, tax }));
  };

  const addItemToPurchase = () => {
    if (!currentItem.productId) {
      alert("يرجى اختيار منتج");
      return;
    }

    const newItem: PurchaseItem = {
      id: Date.now().toString(),
      productId: currentItem.productId,
      productName: currentItem.productName,
      quantity: currentItem.quantity,
      price: currentItem.price,
      total: currentItem.total,
      tax: currentItem.tax,
    };

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));

    setCurrentItem({
      productId: "",
      productName: "",
      quantity: 1,
      price: 0,
      total: 0,
      tax: 0,
    });
  };

  const removeItemFromPurchase = (itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  useEffect(() => {
    updateCurrentItemTotal();
  }, [currentItem.quantity, currentItem.price]);

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
              <Truck className="h-6 w-6" />
            </div>
            إدارة المشتريات
          </h1>
          <p className="text-gray-600">إدارة طلبات الشراء والموردين</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-500" />
                فاتورة مشتريات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog
                open={isNewPurchaseOpen}
                onOpenChange={setIsNewPurchaseOpen}
              >
                <DialogTrigger asChild>
                  <Button className="w-full bg-green-500 hover:bg-green-600">
                    إنشاء فاتورة
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>إنشاء فاتورة مشتريات</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="supplier">المورد</Label>
                        <Select
                          value={formData.supplier}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              supplier: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المورد" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="مورد عام">مورد عام</SelectItem>
                            {suppliers.map((supplier) => (
                              <SelectItem
                                key={supplier.id}
                                value={supplier.name}
                              >
                                {supplier.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">التاريخ</Label>
                        <Input
                          type="date"
                          value={formData.date}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              date: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">إضافة منتج</h4>
                      <div className="space-y-2">
                        <Label htmlFor="product">المنتج</Label>
                        <Select
                          value={currentItem.productName}
                          onValueChange={handleProductSelect}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المنتج" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.length > 0 ? (
                              products.map((product) => (
                                <SelectItem
                                  key={product.id}
                                  value={product.name}
                                >
                                  {product.name} -{" "}
                                  {product.purchasePrice || product.salePrice}{" "}
                                  ر.س
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="" disabled>
                                لا توجد منتجات
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-5 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="quantity">الكمية</Label>
                          <Input
                            type="number"
                            value={currentItem.quantity}
                            onChange={(e) =>
                              setCurrentItem((prev) => ({
                                ...prev,
                                quantity: parseInt(e.target.value) || 1,
                              }))
                            }
                            min="1"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price">السعر</Label>
                          <Input
                            type="number"
                            value={currentItem.price}
                            onChange={(e) =>
                              setCurrentItem((prev) => ({
                                ...prev,
                                price: parseFloat(e.target.value) || 0,
                              }))
                            }
                            step="0.01"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tax">الضريبة</Label>
                          <Input
                            type="number"
                            value={currentItem.tax.toFixed(2)}
                            step="0.01"
                            readOnly
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="total">الإجمالي</Label>
                          <Input
                            type="number"
                            value={currentItem.total.toFixed(2)}
                            step="0.01"
                            readOnly
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>&nbsp;</Label>
                          <Button
                            type="button"
                            onClick={addItemToPurchase}
                            className="w-full"
                          >
                            إضافة
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* قائمة المنتجات المضافة */}
                    {formData.items.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold">المنتجات المضافة</h4>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="p-2 text-right">المنتج</th>
                                <th className="p-2 text-right">الكمية</th>
                                <th className="p-2 text-right">السعر</th>
                                <th className="p-2 text-right">الضريبة</th>
                                <th className="p-2 text-right">الإجمالي</th>
                                <th className="p-2 text-center">إجراء</th>
                              </tr>
                            </thead>
                            <tbody>
                              {formData.items.map((item) => (
                                <tr key={item.id}>
                                  <td className="p-2">{item.productName}</td>
                                  <td className="p-2">{item.quantity}</td>
                                  <td className="p-2">
                                    {item.price.toFixed(2)} ر.س
                                  </td>
                                  <td className="p-2">
                                    {(item.tax || 0).toFixed(2)} ر.س
                                  </td>
                                  <td className="p-2">
                                    {item.total.toFixed(2)} ر.س
                                  </td>
                                  <td className="p-2 text-center">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        removeItemFromPurchase(item.id)
                                      }
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      حذف
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="bg-gray-50">
                              <tr>
                                <td
                                  colSpan={3}
                                  className="p-2 font-semibold text-right"
                                >
                                  المجموع الفرعي:
                                </td>
                                <td className="p-2 font-semibold">
                                  {formData.items
                                    .reduce(
                                      (sum, item) =>
                                        sum + item.price * item.quantity,
                                      0,
                                    )
                                    .toFixed(2)}{" "}
                                  ر.س
                                </td>
                                <td className="p-2 font-semibold">
                                  {formData.items
                                    .reduce(
                                      (sum, item) => sum + (item.tax || 0),
                                      0,
                                    )
                                    .toFixed(2)}{" "}
                                  ر.س
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td
                                  colSpan={4}
                                  className="p-2 font-semibold text-right"
                                >
                                  الإجمالي الكلي:
                                </td>
                                <td className="p-2 font-semibold">
                                  {formData.items
                                    .reduce((sum, item) => sum + item.total, 0)
                                    .toFixed(2)}{" "}
                                  ر.س
                                </td>
                                <td></td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsNewPurchaseOpen(false)}
                    >
                      إلغاء
                    </Button>
                    <Button
                      onClick={handleCreatePurchase}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      إنشاء الفاتورة
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                طلبات الشراء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {purchases.length}
              </p>
              <p className="text-sm text-gray-500">إجمالي الطلبات</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-500" />
                المشتريات اليوم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">0 ر.س</p>
              <p className="text-sm text-gray-500">0 طلب</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5 text-purple-500" />
                المشتريات الشهر
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600">0 ر.س</p>
              <p className="text-sm text-gray-500">0 طلب</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">آخر طلبات الشراء</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-right border">رقم الطلب</th>
                    <th className="p-3 text-right border">المورد</th>
                    <th className="p-3 text-right border">التاريخ</th>
                    <th className="p-3 text-right border">المبلغ</th>
                    <th className="p-3 text-right border">الحالة</th>
                    <th className="p-3 text-right border">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase) => (
                    <tr key={purchase.id}>
                      <td className="p-3 border">{purchase.id}</td>
                      <td className="p-3 border">{purchase.supplier}</td>
                      <td className="p-3 border">{purchase.date}</td>
                      <td className="p-3 border">
                        {purchase.amount.toFixed(2)} ر.س
                      </td>
                      <td className="p-3 border">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            purchase.status === "مستلم"
                              ? "bg-green-100 text-green-800"
                              : purchase.status === "قيد التنفيذ"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {purchase.status}
                        </span>
                      </td>
                      <td className="p-3 border">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewPurchase(purchase)}
                            className="p-2"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePrintPurchase(purchase)}
                            className="p-2 text-blue-600 hover:text-blue-700"
                            title="طباعة"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="6,9 6,2 18,2 18,9" />
                              <path d="M6,18H4a2,2,0,0,1-2-2V11a2,2,0,0,1,2-2H20a2,2,0,0,1,2,2v5a2,2,0,0,1-2,2H18" />
                              <rect x="6" y="14" width="12" height="8" />
                            </svg>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleExportPDF(purchase)}
                            className="p-2 text-green-600 hover:text-green-700"
                            title="تصدير PDF"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14,2 14,8 20,8" />
                              <line x1="16" y1="13" x2="8" y2="13" />
                              <line x1="16" y1="17" x2="8" y2="17" />
                              <polyline points="10,9 9,9 8,9" />
                            </svg>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleExportExcel(purchase)}
                            className="p-2 text-purple-600 hover:text-purple-700"
                            title="تصدير Excel"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14,2 14,8 20,8" />
                              <line x1="9" y1="15" x2="15" y2="9" />
                              <line x1="15" y1="15" x2="9" y2="9" />
                            </svg>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditPurchase(purchase)}
                            className="p-2"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeletePurchase(purchase.id)}
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

        {/* Edit Purchase Dialog */}
        <Dialog open={isEditPurchaseOpen} onOpenChange={setIsEditPurchaseOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تعديل طلب الشراء</DialogTitle>
            </DialogHeader>
            {editingPurchase && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editSupplier">المورد</Label>
                    <Input
                      value={editingPurchase.supplier}
                      onChange={(e) =>
                        setEditingPurchase((prev) =>
                          prev ? { ...prev, supplier: e.target.value } : null,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editDate">التاريخ</Label>
                    <Input
                      type="date"
                      value={editingPurchase.date}
                      onChange={(e) =>
                        setEditingPurchase((prev) =>
                          prev ? { ...prev, date: e.target.value } : null,
                        )
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editAmount">المبلغ</Label>
                    <Input
                      type="number"
                      value={editingPurchase.amount}
                      onChange={(e) =>
                        setEditingPurchase((prev) =>
                          prev
                            ? {
                                ...prev,
                                amount: parseFloat(e.target.value) || 0,
                              }
                            : null,
                        )
                      }
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editStatus">الحالة</Label>
                    <Select
                      value={editingPurchase.status}
                      onValueChange={(value) =>
                        setEditingPurchase((prev) =>
                          prev ? { ...prev, status: value } : null,
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="جديد">جديد</SelectItem>
                        <SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem>
                        <SelectItem value="مستلم">مستلم</SelectItem>
                        <SelectItem value="ملغي">ملغي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditPurchaseOpen(false)}
              >
                إلغاء
              </Button>
              <Button
                onClick={handleUpdatePurchase}
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

export default Purchases;
