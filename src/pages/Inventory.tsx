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
import { Textarea } from "@/components/ui/textarea";
import NavigationBar from "@/components/dashboard/NavigationBar";
import {
  Package,
  Plus,
  AlertTriangle,
  TrendingDown,
  FolderPlus,
  Edit,
  Trash2,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  purchasePrice: number;
  salePrice: number;
  quantity: number;
  status: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

const Inventory = () => {
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    code: "",
    category: "",
    description: "",
    purchasePrice: 0,
    salePrice: 0,
    quantity: 0,
  });
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedProducts = localStorage.getItem("inventory_products");
    const savedCategories = localStorage.getItem("inventory_categories");

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Initialize with sample data
      const sampleProducts: Product[] = [
        {
          id: "1",
          name: "لابتوب ديل XPS 13",
          code: "LAP001",
          category: "حاسوب",
          description: "لابتوب عالي الأداء",
          purchasePrice: 3200,
          salePrice: 4500,
          quantity: 15,
          status: "متوفر",
        },
        {
          id: "2",
          name: "ماوس لوجيتك MX Master",
          code: "MOU001",
          category: "إكسسوارات",
          description: "ماوس لاسلكي متقدم",
          purchasePrice: 180,
          salePrice: 250,
          quantity: 3,
          status: "منخفض",
        },
        {
          id: "3",
          name: "كيبورد ميكانيكي",
          code: "KEY001",
          category: "إكسسوارات",
          description: "كيبورد ميكانيكي للألعاب",
          purchasePrice: 120,
          salePrice: 180,
          quantity: 25,
          status: "متوفر",
        },
      ];
      setProducts(sampleProducts);
      localStorage.setItem(
        "inventory_products",
        JSON.stringify(sampleProducts),
      );
    }

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      // Initialize with sample categories
      const sampleCategories: Category[] = [
        {
          id: "1",
          name: "حاسوب",
          description: "أجهزة الحاسوب واللابتوب",
        },
        {
          id: "2",
          name: "إكسسوارات",
          description: "إكسسوارات الحاسوب والهواتف",
        },
        {
          id: "3",
          name: "هواتف",
          description: "الهواتف الذكية والأجهزة اللوحية",
        },
      ];
      setCategories(sampleCategories);
      localStorage.setItem(
        "inventory_categories",
        JSON.stringify(sampleCategories),
      );
    }
  };

  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem("inventory_products", JSON.stringify(updatedProducts));
  };

  const saveCategories = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
    localStorage.setItem(
      "inventory_categories",
      JSON.stringify(updatedCategories),
    );
  };

  const handleCreateProduct = () => {
    if (newProduct.name && newProduct.code) {
      const product: Product = {
        id: Date.now().toString(),
        ...newProduct,
        status:
          newProduct.quantity > 10
            ? "متوفر"
            : newProduct.quantity > 0
              ? "منخفض"
              : "نفد",
      };
      const updatedProducts = [...products, product];
      saveProducts(updatedProducts);
      setNewProduct({
        name: "",
        code: "",
        category: "",
        description: "",
        purchasePrice: 0,
        salePrice: 0,
        quantity: 0,
      });
      setIsNewProductOpen(false);
      // Force reload data to ensure UI updates
      setTimeout(() => {
        loadData();
      }, 100);
    }
  };

  const handleCreateCategory = () => {
    if (newCategory.name) {
      const category: Category = {
        id: Date.now().toString(),
        ...newCategory,
      };
      const updatedCategories = [...categories, category];
      saveCategories(updatedCategories);
      setNewCategory({ name: "", description: "" });
      setIsNewCategoryOpen(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditProductOpen(true);
  };

  const handleUpdateProduct = () => {
    if (editingProduct) {
      const updatedProducts = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...editingProduct,
              status:
                editingProduct.quantity > 10
                  ? "متوفر"
                  : editingProduct.quantity > 0
                    ? "منخفض"
                    : "نفد",
            }
          : p,
      );
      saveProducts(updatedProducts);
      setEditingProduct(null);
      setIsEditProductOpen(false);
      // Force reload data to ensure UI updates
      setTimeout(() => {
        loadData();
      }, 100);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      const updatedProducts = products.filter((p) => p.id !== productId);
      saveProducts(updatedProducts);
      // Force reload data to ensure UI updates
      setTimeout(() => {
        loadData();
      }, 100);
    }
  };

  const getTotalProducts = () => products.length;
  const getLowStockProducts = () =>
    products.filter((p) => p.quantity <= 10 && p.quantity > 0).length;
  const getTotalValue = () =>
    products.reduce((sum, p) => sum + p.salePrice * p.quantity, 0);

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
              <Package className="h-6 w-6" />
            </div>
            إدارة المخزون
          </h1>
          <p className="text-gray-600">
            إدارة المنتجات والمخزون ومتابعة الكميات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-500" />
                منتج جديد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Dialog
                  open={isNewProductOpen}
                  onOpenChange={setIsNewProductOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full bg-green-500 hover:bg-green-600">
                      إضافة منتج
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>إضافة منتج جديد</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="productName">اسم المنتج</Label>
                          <Input
                            placeholder="أدخل اسم المنتج"
                            value={newProduct.name}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="productCode">كود المنتج</Label>
                          <Input
                            placeholder="PRD001"
                            value={newProduct.code}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                code: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">الفئة</Label>
                        <Select
                          value={newProduct.category}
                          onValueChange={(value) =>
                            setNewProduct({
                              ...newProduct,
                              category: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الفئة" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.name}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                            <SelectItem value="أخرى">أخرى</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">الوصف</Label>
                        <Textarea
                          placeholder="وصف المنتج"
                          value={newProduct.description}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="purchasePrice">سعر الشراء</Label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                            value={newProduct.purchasePrice}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                purchasePrice: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="salePrice">سعر البيع</Label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                            value={newProduct.salePrice}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                salePrice: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="quantity">الكمية</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            min="0"
                            value={newProduct.quantity}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                quantity: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsNewProductOpen(false)}
                      >
                        إلغاء
                      </Button>
                      <Button
                        onClick={handleCreateProduct}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        إضافة المنتج
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog
                  open={isNewCategoryOpen}
                  onOpenChange={setIsNewCategoryOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <FolderPlus className="h-4 w-4 mr-2" />
                      فئة جديدة
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>إضافة فئة جديدة</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="categoryName">اسم الفئة</Label>
                        <Input
                          placeholder="أدخل اسم الفئة"
                          value={newCategory.name}
                          onChange={(e) =>
                            setNewCategory({
                              ...newCategory,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="categoryDescription">الوصف</Label>
                        <Textarea
                          placeholder="وصف الفئة"
                          value={newCategory.description}
                          onChange={(e) =>
                            setNewCategory({
                              ...newCategory,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsNewCategoryOpen(false)}
                      >
                        إلغاء
                      </Button>
                      <Button
                        onClick={handleCreateCategory}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        إضافة الفئة
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-green-500" />
                إجمالي المنتجات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {getTotalProducts()}
              </p>
              <p className="text-sm text-gray-500">منتج في المخزون</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                منتجات منخفضة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                {getLowStockProducts()}
              </p>
              <p className="text-sm text-gray-500">تحتاج إعادة طلب</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-purple-500" />
                قيمة المخزون
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {getTotalValue().toLocaleString()} ر.س
              </p>
              <p className="text-sm text-gray-500">إجمالي القيمة</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">المنتجات في المخزون</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-right border">اسم المنتج</th>
                    <th className="p-3 text-right border">الكود</th>
                    <th className="p-3 text-right border">الكمية المتاحة</th>
                    <th className="p-3 text-right border">سعر الشراء</th>
                    <th className="p-3 text-right border">سعر البيع</th>
                    <th className="p-3 text-right border">الحالة</th>
                    <th className="p-3 text-right border">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="p-3 border">{product.name}</td>
                      <td className="p-3 border">{product.code}</td>
                      <td className="p-3 border">{product.quantity}</td>
                      <td className="p-3 border">
                        {product.purchasePrice.toFixed(2)} ر.س
                      </td>
                      <td className="p-3 border">
                        {product.salePrice.toFixed(2)} ر.س
                      </td>
                      <td className="p-3 border">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            product.status === "متوفر"
                              ? "bg-green-100 text-green-800"
                              : product.status === "منخفض"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="p-3 border">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
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

        {/* Edit Product Dialog */}
        <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تعديل المنتج</DialogTitle>
            </DialogHeader>
            {editingProduct && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editProductName">اسم المنتج</Label>
                    <Input
                      placeholder="أدخل اسم المنتج"
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editProductCode">كود المنتج</Label>
                    <Input
                      placeholder="PRD001"
                      value={editingProduct.code}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          code: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editCategory">الفئة</Label>
                  <Select
                    value={editingProduct.category}
                    onValueChange={(value) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="أخرى">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editDescription">الوصف</Label>
                  <Textarea
                    placeholder="وصف المنتج"
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editPurchasePrice">سعر الشراء</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      value={editingProduct.purchasePrice}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          purchasePrice: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editSalePrice">سعر البيع</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      value={editingProduct.salePrice}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          salePrice: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editQuantity">الكمية</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      min="0"
                      value={editingProduct.quantity}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          quantity: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditProductOpen(false)}
              >
                إلغاء
              </Button>
              <Button
                onClick={handleUpdateProduct}
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

export default Inventory;
