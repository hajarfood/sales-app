import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NavigationBar from "@/components/dashboard/NavigationBar";
import {
  Settings as SettingsIcon,
  User,
  Building,
  Shield,
  Bell,
  Upload,
  Palette,
  Plus,
  Edit,
  Trash2,
  Save,
} from "lucide-react";

interface CompanySettings {
  name: string;
  taxNumber: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
}

interface Role {
  id: string;
  name: string;
  displayName: string;
  permissions: string[];
  description: string;
  isCustom: boolean;
}

interface Permission {
  id: string;
  name: string;
  displayName: string;
  category: string;
  description: string;
}

interface SystemColors {
  primary: string;
  secondary: string;
  accent: string;
}

const Settings = () => {
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    name: "اسم المؤسسة",
    taxNumber: "123456789",
    address: "الرياض، المملكة العربية السعودية",
    phone: "+966501234567",
    email: "info@company.com",
    logo: "",
  });

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "أحمد محمد",
      email: "ahmed@company.com",
      role: "admin",
      status: "نشط",
      permissions: [
        "sales",
        "purchases",
        "customers",
        "suppliers",
        "inventory",
        "reports",
        "accounting",
        "settings",
      ],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    },
    {
      id: "2",
      name: "فاطمة علي",
      email: "fatima@company.com",
      role: "accountant",
      status: "نشط",
      permissions: ["sales", "purchases", "reports", "accounting"],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    },
    {
      id: "3",
      name: "خالد سعد",
      email: "khalid@company.com",
      role: "cashier",
      status: "غير متصل",
      permissions: ["sales", "customers"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      name: "مريم أحمد",
      email: "mariam@company.com",
      role: "seller",
      status: "نشط",
      permissions: ["sales", "customers", "inventory"],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    },
  ]);

  const [roles, setRoles] = useState<Role[]>([
    {
      id: "admin",
      name: "admin",
      displayName: "مدير النظام",
      permissions: [
        "sales",
        "purchases",
        "customers",
        "suppliers",
        "inventory",
        "reports",
        "accounting",
        "settings",
      ],
      description: "صلاحيات كاملة لجميع أجزاء النظام",
      isCustom: false,
    },
    {
      id: "manager",
      name: "manager",
      displayName: "مدير فرع",
      permissions: [
        "sales",
        "purchases",
        "customers",
        "suppliers",
        "inventory",
        "reports",
      ],
      description: "إدارة العمليات اليومية والتقارير",
      isCustom: false,
    },
    {
      id: "accountant",
      name: "accountant",
      displayName: "محاسب",
      permissions: ["sales", "purchases", "reports", "accounting"],
      description: "إدارة الحسابات والتقارير المالية",
      isCustom: false,
    },
    {
      id: "cashier",
      name: "cashier",
      displayName: "كاشير",
      permissions: ["sales", "customers"],
      description: "إدارة المبيعات والعملاء فقط",
      isCustom: false,
    },
    {
      id: "seller",
      name: "seller",
      displayName: "بائع",
      permissions: ["sales", "customers", "inventory"],
      description: "المبيعات والعملاء والمخزون",
      isCustom: false,
    },
  ]);

  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: "sales",
      name: "sales",
      displayName: "المبيعات",
      category: "العمليات",
      description: "إدارة المبيعات والفواتير",
    },
    {
      id: "purchases",
      name: "purchases",
      displayName: "المشتريات",
      category: "العمليات",
      description: "إدارة المشتريات وفواتير الموردين",
    },
    {
      id: "customers",
      name: "customers",
      displayName: "العملاء",
      category: "إدارة البيانات",
      description: "إدارة بيانات العملاء",
    },
    {
      id: "suppliers",
      name: "suppliers",
      displayName: "الموردين",
      category: "إدارة البيانات",
      description: "إدارة بيانات الموردين",
    },
    {
      id: "inventory",
      name: "inventory",
      displayName: "المخزون",
      category: "إدارة البيانات",
      description: "إدارة المخزون والمنتجات",
    },
    {
      id: "reports",
      name: "reports",
      displayName: "التقارير",
      category: "التقارير",
      description: "عرض وإنشاء التقارير",
    },
    {
      id: "accounting",
      name: "accounting",
      displayName: "المحاسبة",
      category: "المالية",
      description: "إدارة الحسابات والقيود المحاسبية",
    },
    {
      id: "settings",
      name: "settings",
      displayName: "الإعدادات",
      category: "الإدارة",
      description: "إدارة إعدادات النظام",
    },
  ]);

  const [systemColors, setSystemColors] = useState<SystemColors>({
    primary: "#3b82f6",
    secondary: "#10b981",
    accent: "#8b5cf6",
  });

  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] =
    useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isUserPermissionDialogOpen, setIsUserPermissionDialogOpen] =
    useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedUserForPermissions, setSelectedUserForPermissions] =
    useState<User | null>(null);
  const [selectedUserForPassword, setSelectedUserForPassword] =
    useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    permissions: [] as string[],
  });
  const [newRole, setNewRole] = useState({
    name: "",
    displayName: "",
    description: "",
    permissions: [] as string[],
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    systemAlerts: true,
    dailyReports: true,
    weeklyReports: true,
    monthlyReports: false,
  });

  const [systemSettings, setSystemSettings] = useState({
    autoSave: true,
    darkMode: false,
    twoFactorAuth: true,
    dataEncryption: true,
    autoBackup: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const getRoleDisplayName = (roleName: string): string => {
    const role = roles.find((r) => r.name === roleName);
    return role ? role.displayName : roleName;
  };

  const getPermissionDisplayName = (permissionName: string): string => {
    const permission = permissions.find((p) => p.name === permissionName);
    return permission ? permission.displayName : permissionName;
  };

  const loadSettings = () => {
    const savedCompany = localStorage.getItem("company_settings");
    const savedUsers = localStorage.getItem("system_users");
    const savedRoles = localStorage.getItem("system_roles");
    const savedPermissions = localStorage.getItem("system_permissions");
    const savedColors = localStorage.getItem("system_colors");
    const savedNotifications = localStorage.getItem("notification_settings");
    const savedSystemSettings = localStorage.getItem("system_settings");

    if (savedCompany) {
      setCompanySettings(JSON.parse(savedCompany));
    }
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    if (savedRoles) {
      setRoles(JSON.parse(savedRoles));
    }
    if (savedPermissions) {
      setPermissions(JSON.parse(savedPermissions));
    }
    if (savedColors) {
      setSystemColors(JSON.parse(savedColors));
    }
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
    if (savedSystemSettings) {
      setSystemSettings(JSON.parse(savedSystemSettings));
    }
  };

  const saveCompanySettings = () => {
    localStorage.setItem("company_settings", JSON.stringify(companySettings));
    setIsCompanyDialogOpen(false);
    alert("تم حفظ إعدادات الشركة بنجاح!");
    // Trigger a page refresh to show updated company info
    window.location.reload();
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCompanySettings({
          ...companySettings,
          logo: e.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateUser = () => {
    if (newUser.name && newUser.email && newUser.role && newUser.password) {
      // Check if email already exists
      if (users.some((u) => u.email === newUser.email)) {
        alert("البريد الإلكتروني مستخدم بالفعل");
        return;
      }

      // Get role permissions
      const selectedRole = roles.find((r) => r.name === newUser.role);
      const rolePermissions = selectedRole ? selectedRole.permissions : [];

      const user: User = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: "نشط",
        permissions: [...rolePermissions, ...newUser.permissions],
        createdAt: new Date().toISOString(),
      };
      const updatedUsers = [...users, user];
      setUsers(updatedUsers);
      localStorage.setItem("system_users", JSON.stringify(updatedUsers));
      setNewUser({
        name: "",
        email: "",
        role: "",
        password: "",
        permissions: [],
      });
      setIsUserDialogOpen(false);
      alert("تم إضافة المستخدم بنجاح!");
    } else {
      alert("يرجى ملء جميع الحقول المطلوبة");
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
      permissions: user.permissions || [],
    });
    setIsUserDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    if (newUser.name && newUser.email && newUser.role) {
      // Check if email already exists (excluding current user)
      if (
        users.some((u) => u.email === newUser.email && u.id !== editingUser.id)
      ) {
        alert("البريد الإلكتروني مستخدم بالفعل");
        return;
      }

      // Get role permissions
      const selectedRole = roles.find((r) => r.name === newUser.role);
      const rolePermissions = selectedRole ? selectedRole.permissions : [];

      const updatedUser: User = {
        ...editingUser,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        permissions: [...rolePermissions, ...newUser.permissions],
      };

      const updatedUsers = users.map((u) =>
        u.id === editingUser.id ? updatedUser : u,
      );
      setUsers(updatedUsers);
      localStorage.setItem("system_users", JSON.stringify(updatedUsers));
      setNewUser({
        name: "",
        email: "",
        role: "",
        password: "",
        permissions: [],
      });
      setEditingUser(null);
      setIsUserDialogOpen(false);
      alert("تم تحديث المستخدم بنجاح!");
    } else {
      alert("يرجى ملء جميع الحقول المطلوبة");
    }
  };

  const handleCreateRole = () => {
    if (newRole.name && newRole.displayName && newRole.permissions.length > 0) {
      // Check if role name already exists
      if (roles.some((r) => r.name === newRole.name)) {
        alert("اسم الدور مستخدم بالفعل");
        return;
      }

      const role: Role = {
        id: Date.now().toString(),
        name: newRole.name,
        displayName: newRole.displayName,
        description: newRole.description,
        permissions: newRole.permissions,
        isCustom: true,
      };
      const updatedRoles = [...roles, role];
      setRoles(updatedRoles);
      localStorage.setItem("system_roles", JSON.stringify(updatedRoles));
      setNewRole({
        name: "",
        displayName: "",
        description: "",
        permissions: [],
      });
      setIsRoleDialogOpen(false);
      alert("تم إضافة الدور بنجاح!");
    } else {
      alert("يرجى ملء جميع الحقول المطلوبة واختيار صلاحية واحدة على الأقل");
    }
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setNewRole({
      name: role.name,
      displayName: role.displayName,
      description: role.description,
      permissions: role.permissions,
    });
    setIsRoleDialogOpen(true);
  };

  const handleUpdateRole = () => {
    if (!editingRole) return;

    if (newRole.displayName && newRole.permissions.length > 0) {
      const updatedRole: Role = {
        ...editingRole,
        displayName: newRole.displayName,
        description: newRole.description,
        permissions: newRole.permissions,
      };

      const updatedRoles = roles.map((r) =>
        r.id === editingRole.id ? updatedRole : r,
      );
      setRoles(updatedRoles);
      localStorage.setItem("system_roles", JSON.stringify(updatedRoles));

      // Update users with this role
      const updatedUsers = users.map((user) => {
        if (user.role === editingRole.name) {
          return {
            ...user,
            permissions: [
              ...updatedRole.permissions,
              ...user.permissions.filter(
                (p) => !editingRole.permissions.includes(p),
              ),
            ],
          };
        }
        return user;
      });
      setUsers(updatedUsers);
      localStorage.setItem("system_users", JSON.stringify(updatedUsers));

      setNewRole({
        name: "",
        displayName: "",
        description: "",
        permissions: [],
      });
      setEditingRole(null);
      setIsRoleDialogOpen(false);
      alert("تم تحديث الدور بنجاح!");
    } else {
      alert("يرجى ملء جميع الحقول المطلوبة واختيار صلاحية واحدة على الأقل");
    }
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    if (!role) return;

    if (!role.isCustom) {
      alert("لا يمكن حذف الأدوار الافتراضية");
      return;
    }

    // Check if any users have this role
    if (users.some((u) => u.role === role.name)) {
      alert("لا يمكن حذف هذا الدور لأنه مستخدم من قبل مستخدمين");
      return;
    }

    if (confirm(`هل أنت متأكد من حذف الدور "${role.displayName}"؟`)) {
      const updatedRoles = roles.filter((r) => r.id !== roleId);
      setRoles(updatedRoles);
      localStorage.setItem("system_roles", JSON.stringify(updatedRoles));
      alert("تم حذف الدور بنجاح!");
    }
  };

  const handleChangePassword = () => {
    if (!selectedUserForPassword) return;

    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      alert("يرجى ملء جميع الحقول");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقتين");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    // In a real application, you would hash the password and update it in the database
    alert(
      `تم تغيير كلمة المرور للمستخدم "${selectedUserForPassword.name}" بنجاح!`,
    );
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setSelectedUserForPassword(null);
    setIsPasswordDialogOpen(false);
  };

  const handleUpdateUserPermissions = () => {
    if (!selectedUserForPermissions) return;

    const updatedUser = {
      ...selectedUserForPermissions,
      permissions: newUser.permissions,
    };

    const updatedUsers = users.map((u) =>
      u.id === selectedUserForPermissions.id ? updatedUser : u,
    );
    setUsers(updatedUsers);
    localStorage.setItem("system_users", JSON.stringify(updatedUsers));

    setSelectedUserForPermissions(null);
    setNewUser({
      name: "",
      email: "",
      role: "",
      password: "",
      permissions: [],
    });
    setIsUserPermissionDialogOpen(false);
    alert("تم تحديث صلاحيات المستخدم بنجاح!");
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      const updatedUsers = users.filter((u) => u.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem("system_users", JSON.stringify(updatedUsers));
    }
  };

  const saveSystemColors = () => {
    localStorage.setItem("system_colors", JSON.stringify(systemColors));

    // Apply colors to CSS variables immediately
    const root = document.documentElement;
    root.style.setProperty("--primary", systemColors.primary);
    root.style.setProperty("--secondary", systemColors.secondary);
    root.style.setProperty("--accent", systemColors.accent);

    // Apply to Tailwind CSS custom properties
    root.style.setProperty("--color-primary", systemColors.primary);
    root.style.setProperty("--color-secondary", systemColors.secondary);
    root.style.setProperty("--color-accent", systemColors.accent);

    // Convert hex to HSL for better CSS integration
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0,
        s = 0,
        l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    root.style.setProperty("--primary-hsl", hexToHsl(systemColors.primary));
    root.style.setProperty("--secondary-hsl", hexToHsl(systemColors.secondary));
    root.style.setProperty("--accent-hsl", hexToHsl(systemColors.accent));

    // Update all elements with primary colors
    const primaryElements = document.querySelectorAll(
      ".bg-primary, .text-primary, .border-primary",
    );
    primaryElements.forEach((el) => {
      if (el.classList.contains("bg-primary")) {
        (el as HTMLElement).style.backgroundColor = systemColors.primary;
      }
      if (el.classList.contains("text-primary")) {
        (el as HTMLElement).style.color = systemColors.primary;
      }
      if (el.classList.contains("border-primary")) {
        (el as HTMLElement).style.borderColor = systemColors.primary;
      }
    });

    // Update green colors to use the secondary color
    const greenElements = document.querySelectorAll(
      ".bg-green-500, .bg-green-600, .hover\\:bg-green-600, .text-green-600",
    );
    greenElements.forEach((el) => {
      (el as HTMLElement).style.backgroundColor = systemColors.secondary;
      (el as HTMLElement).style.color = "white";
    });

    setIsColorDialogOpen(false);
    alert("تم حفظ وتطبيق ألوان النظام بنجاح!");
  };

  const saveNotificationSettings = () => {
    localStorage.setItem(
      "notification_settings",
      JSON.stringify(notifications),
    );
    setIsNotificationDialogOpen(false);
    alert("تم حفظ إعدادات الإشعارات بنجاح!");
  };

  const saveSystemSettings = () => {
    localStorage.setItem("system_settings", JSON.stringify(systemSettings));
  };

  const createBackup = () => {
    // Collect all data from localStorage
    const customers = JSON.parse(localStorage.getItem("customers") || "[]");
    const suppliers = JSON.parse(localStorage.getItem("suppliers") || "[]");
    const products = JSON.parse(
      localStorage.getItem("inventory_products") || "[]",
    );
    const invoices = JSON.parse(localStorage.getItem("invoices") || "[]");
    const purchases = JSON.parse(localStorage.getItem("purchases") || "[]");
    const journalEntries = JSON.parse(
      localStorage.getItem("journal_entries") || "[]",
    );

    const backupData = {
      company: companySettings,
      users: users,
      colors: systemColors,
      notifications: notifications,
      system: systemSettings,
      customers: customers,
      suppliers: suppliers,
      products: products,
      invoices: invoices,
      purchases: purchases,
      journalEntries: journalEntries,
      timestamp: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `backup-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRestoreBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const backupData = JSON.parse(e.target?.result as string);

          // Apply company settings
          if (backupData.company) {
            setCompanySettings(backupData.company);
            localStorage.setItem(
              "company_settings",
              JSON.stringify(backupData.company),
            );
          }

          // Apply users
          if (backupData.users) {
            setUsers(backupData.users);
            localStorage.setItem(
              "system_users",
              JSON.stringify(backupData.users),
            );
          }

          // Apply colors and immediately apply them
          if (backupData.colors) {
            setSystemColors(backupData.colors);
            localStorage.setItem(
              "system_colors",
              JSON.stringify(backupData.colors),
            );

            // Apply colors immediately
            const root = document.documentElement;
            root.style.setProperty("--primary", backupData.colors.primary);
            root.style.setProperty("--secondary", backupData.colors.secondary);
            root.style.setProperty("--accent", backupData.colors.accent);
          }

          // Apply notifications
          if (backupData.notifications) {
            setNotifications(backupData.notifications);
            localStorage.setItem(
              "notification_settings",
              JSON.stringify(backupData.notifications),
            );
          }

          // Apply system settings
          if (backupData.system) {
            setSystemSettings(backupData.system);
            localStorage.setItem(
              "system_settings",
              JSON.stringify(backupData.system),
            );
          }

          // Restore other data if present
          if (backupData.customers) {
            localStorage.setItem(
              "customers",
              JSON.stringify(backupData.customers),
            );
          }
          if (backupData.suppliers) {
            localStorage.setItem(
              "suppliers",
              JSON.stringify(backupData.suppliers),
            );
          }
          if (backupData.products) {
            localStorage.setItem(
              "inventory_products",
              JSON.stringify(backupData.products),
            );
          }
          if (backupData.invoices) {
            localStorage.setItem(
              "invoices",
              JSON.stringify(backupData.invoices),
            );
          }
          if (backupData.purchases) {
            localStorage.setItem(
              "purchases",
              JSON.stringify(backupData.purchases),
            );
          }

          alert("تم استعادة النسخة الاحتياطية وتطبيق جميع البيانات بنجاح!");

          // Refresh the page to ensure all changes are applied
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (error) {
          console.error("Backup restore error:", error);
          alert("خطأ في قراءة ملف النسخة الاحتياطية");
        }
      };
      reader.readAsText(file);
    }
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
              <SettingsIcon className="h-6 w-6" />
            </div>
            إعدادات النظام
          </h1>
          <p className="text-gray-600">إدارة إعدادات النظام والمستخدمين</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-500" />
                إعدادات الشركة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog
                open={isCompanyDialogOpen}
                onOpenChange={setIsCompanyDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    تحديث البيانات
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>إعدادات الشركة</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>اسم الشركة</Label>
                        <Input
                          value={companySettings.name}
                          onChange={(e) =>
                            setCompanySettings({
                              ...companySettings,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>الرقم الضريبي</Label>
                        <Input
                          value={companySettings.taxNumber}
                          onChange={(e) =>
                            setCompanySettings({
                              ...companySettings,
                              taxNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>العنوان</Label>
                      <Textarea
                        value={companySettings.address}
                        onChange={(e) =>
                          setCompanySettings({
                            ...companySettings,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>رقم الهاتف</Label>
                        <Input
                          value={companySettings.phone}
                          onChange={(e) =>
                            setCompanySettings({
                              ...companySettings,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>البريد الإلكتروني</Label>
                        <Input
                          type="email"
                          value={companySettings.email}
                          onChange={(e) =>
                            setCompanySettings({
                              ...companySettings,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>شعار الشركة</Label>
                      <div className="flex items-center gap-4">
                        {companySettings.logo && (
                          <img
                            src={companySettings.logo}
                            alt="شعار الشركة"
                            className="w-16 h-16 object-contain border rounded"
                          />
                        )}
                        <div className="flex-1">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                            id="logo-upload"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById("logo-upload")?.click()
                            }
                            className="w-full"
                          >
                            اختر شعار
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCompanyDialogOpen(false)}
                    >
                      إلغاء
                    </Button>
                    <Button
                      onClick={saveCompanySettings}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      حفظ التغييرات
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-green-500" />
                إدارة المستخدمين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog
                open={isUserDialogOpen}
                onOpenChange={setIsUserDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="w-full bg-green-500 hover:bg-green-600">
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة مستخدم جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingUser ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>الاسم</Label>
                        <Input
                          value={newUser.name}
                          onChange={(e) =>
                            setNewUser({ ...newUser, name: e.target.value })
                          }
                          placeholder="أدخل اسم المستخدم"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>البريد الإلكتروني</Label>
                        <Input
                          type="email"
                          value={newUser.email}
                          onChange={(e) =>
                            setNewUser({ ...newUser, email: e.target.value })
                          }
                          placeholder="أدخل البريد الإلكتروني"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>الدور</Label>
                        <Select
                          value={newUser.role}
                          onValueChange={(value) => {
                            const selectedRole = roles.find(
                              (r) => r.name === value,
                            );
                            setNewUser({
                              ...newUser,
                              role: value,
                              permissions: selectedRole
                                ? selectedRole.permissions
                                : [],
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الدور" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.name}>
                                {role.displayName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {!editingUser && (
                        <div className="space-y-2">
                          <Label>كلمة المرور</Label>
                          <Input
                            type="password"
                            value={newUser.password}
                            onChange={(e) =>
                              setNewUser({
                                ...newUser,
                                password: e.target.value,
                              })
                            }
                            placeholder="أدخل كلمة المرور"
                          />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>صلاحيات إضافية</Label>
                      <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-3">
                        {permissions.map((permission) => {
                          const rolePermissions = newUser.role
                            ? roles.find((r) => r.name === newUser.role)
                                ?.permissions || []
                            : [];
                          const isRolePermission = rolePermissions.includes(
                            permission.name,
                          );
                          const isAdditionalPermission =
                            newUser.permissions.includes(permission.name) &&
                            !isRolePermission;

                          return (
                            <label
                              key={permission.id}
                              className="flex items-center space-x-2 space-x-reverse"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  isRolePermission || isAdditionalPermission
                                }
                                disabled={isRolePermission}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewUser({
                                      ...newUser,
                                      permissions: [
                                        ...newUser.permissions,
                                        permission.name,
                                      ],
                                    });
                                  } else {
                                    setNewUser({
                                      ...newUser,
                                      permissions: newUser.permissions.filter(
                                        (p) => p !== permission.name,
                                      ),
                                    });
                                  }
                                }}
                                className="ml-2"
                              />
                              <div>
                                <span
                                  className={`text-sm ${isRolePermission ? "text-gray-500" : ""}`}
                                >
                                  {permission.displayName}
                                  {isRolePermission && " (من الدور)"}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsUserDialogOpen(false);
                        setEditingUser(null);
                        setNewUser({
                          name: "",
                          email: "",
                          role: "",
                          password: "",
                          permissions: [],
                        });
                      }}
                    >
                      إلغاء
                    </Button>
                    <Button
                      onClick={
                        editingUser ? handleUpdateUser : handleCreateUser
                      }
                      className="bg-green-500 hover:bg-green-600"
                    >
                      {editingUser ? "تحديث المستخدم" : "إضافة المستخدم"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-500" />
                إدارة الأدوار
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog
                open={isRoleDialogOpen}
                onOpenChange={setIsRoleDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600">
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة دور جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingRole ? "تعديل الدور" : "إضافة دور جديد"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>اسم الدور (بالإنجليزية)</Label>
                        <Input
                          value={newRole.name}
                          onChange={(e) =>
                            setNewRole({ ...newRole, name: e.target.value })
                          }
                          placeholder="role_name"
                          disabled={!!editingRole}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>اسم الدور (بالعربية)</Label>
                        <Input
                          value={newRole.displayName}
                          onChange={(e) =>
                            setNewRole({
                              ...newRole,
                              displayName: e.target.value,
                            })
                          }
                          placeholder="اسم الدور"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>وصف الدور</Label>
                      <Textarea
                        value={newRole.description}
                        onChange={(e) =>
                          setNewRole({
                            ...newRole,
                            description: e.target.value,
                          })
                        }
                        placeholder="وصف مختصر للدور وصلاحياته"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>الصلاحيات</Label>
                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded p-3">
                        {permissions.map((permission) => (
                          <label
                            key={permission.id}
                            className="flex items-center space-x-2 space-x-reverse"
                          >
                            <input
                              type="checkbox"
                              checked={newRole.permissions.includes(
                                permission.name,
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewRole({
                                    ...newRole,
                                    permissions: [
                                      ...newRole.permissions,
                                      permission.name,
                                    ],
                                  });
                                } else {
                                  setNewRole({
                                    ...newRole,
                                    permissions: newRole.permissions.filter(
                                      (p) => p !== permission.name,
                                    ),
                                  });
                                }
                              }}
                              className="ml-2"
                            />
                            <div>
                              <span className="font-medium">
                                {permission.displayName}
                              </span>
                              <p className="text-xs text-gray-500">
                                {permission.description}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsRoleDialogOpen(false);
                        setEditingRole(null);
                        setNewRole({
                          name: "",
                          displayName: "",
                          description: "",
                          permissions: [],
                        });
                      }}
                    >
                      إلغاء
                    </Button>
                    <Button
                      onClick={
                        editingRole ? handleUpdateRole : handleCreateRole
                      }
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      {editingRole ? "تحديث الدور" : "إضافة الدور"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-500" />
                الإشعارات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog
                open={isNotificationDialogOpen}
                onOpenChange={setIsNotificationDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    إعدادات الإشعارات
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>إعدادات الإشعارات</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold">
                        إشعارات البريد الإلكتروني
                      </h4>
                      <label className="flex items-center space-x-2 space-x-reverse">
                        <input
                          type="checkbox"
                          checked={notifications.emailNotifications}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              emailNotifications: e.target.checked,
                            })
                          }
                          className="ml-2"
                        />
                        <span>تفعيل إشعارات البريد الإلكتروني</span>
                      </label>
                      <label className="flex items-center space-x-2 space-x-reverse">
                        <input
                          type="checkbox"
                          checked={notifications.smsNotifications}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              smsNotifications: e.target.checked,
                            })
                          }
                          className="ml-2"
                        />
                        <span>تفعيل إشعارات الرسائل النصية</span>
                      </label>
                      <label className="flex items-center space-x-2 space-x-reverse">
                        <input
                          type="checkbox"
                          checked={notifications.systemAlerts}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              systemAlerts: e.target.checked,
                            })
                          }
                          className="ml-2"
                        />
                        <span>تنبيهات النظام</span>
                      </label>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">التقارير الدورية</h4>
                      <label className="flex items-center space-x-2 space-x-reverse">
                        <input
                          type="checkbox"
                          checked={notifications.dailyReports}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              dailyReports: e.target.checked,
                            })
                          }
                          className="ml-2"
                        />
                        <span>التقارير اليومية</span>
                      </label>
                      <label className="flex items-center space-x-2 space-x-reverse">
                        <input
                          type="checkbox"
                          checked={notifications.weeklyReports}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              weeklyReports: e.target.checked,
                            })
                          }
                          className="ml-2"
                        />
                        <span>التقارير الأسبوعية</span>
                      </label>
                      <label className="flex items-center space-x-2 space-x-reverse">
                        <input
                          type="checkbox"
                          checked={notifications.monthlyReports}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              monthlyReports: e.target.checked,
                            })
                          }
                          className="ml-2"
                        />
                        <span>التقارير الشهرية</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsNotificationDialogOpen(false)}
                    >
                      إلغاء
                    </Button>
                    <Button
                      onClick={saveNotificationSettings}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      حفظ الإعدادات
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-500" />
                ألوان النظام
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog
                open={isColorDialogOpen}
                onOpenChange={setIsColorDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600">
                    تخصيص الألوان
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>ألوان النظام</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>اللون الأساسي</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={systemColors.primary}
                          onChange={(e) =>
                            setSystemColors({
                              ...systemColors,
                              primary: e.target.value,
                            })
                          }
                          className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                          value={systemColors.primary}
                          onChange={(e) =>
                            setSystemColors({
                              ...systemColors,
                              primary: e.target.value,
                            })
                          }
                          placeholder="#3b82f6"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>اللون الثانوي</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={systemColors.secondary}
                          onChange={(e) =>
                            setSystemColors({
                              ...systemColors,
                              secondary: e.target.value,
                            })
                          }
                          className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                          value={systemColors.secondary}
                          onChange={(e) =>
                            setSystemColors({
                              ...systemColors,
                              secondary: e.target.value,
                            })
                          }
                          placeholder="#10b981"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>لون التمييز</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={systemColors.accent}
                          onChange={(e) =>
                            setSystemColors({
                              ...systemColors,
                              accent: e.target.value,
                            })
                          }
                          className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                          value={systemColors.accent}
                          onChange={(e) =>
                            setSystemColors({
                              ...systemColors,
                              accent: e.target.value,
                            })
                          }
                          placeholder="#8b5cf6"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>الألوان المحددة مسبقاً</Label>
                      <div className="grid grid-cols-6 gap-2">
                        {[
                          {
                            name: "أزرق",
                            primary: "#3b82f6",
                            secondary: "#10b981",
                            accent: "#8b5cf6",
                          },
                          {
                            name: "أخضر",
                            primary: "#10b981",
                            secondary: "#3b82f6",
                            accent: "#f59e0b",
                          },
                          {
                            name: "بنفسجي",
                            primary: "#8b5cf6",
                            secondary: "#ec4899",
                            accent: "#06b6d4",
                          },
                          {
                            name: "أحمر",
                            primary: "#ef4444",
                            secondary: "#f97316",
                            accent: "#84cc16",
                          },
                          {
                            name: "برتقالي",
                            primary: "#f97316",
                            secondary: "#ef4444",
                            accent: "#8b5cf6",
                          },
                          {
                            name: "رمادي",
                            primary: "#6b7280",
                            secondary: "#374151",
                            accent: "#9ca3af",
                          },
                        ].map((theme) => (
                          <button
                            key={theme.name}
                            onClick={() =>
                              setSystemColors({
                                primary: theme.primary,
                                secondary: theme.secondary,
                                accent: theme.accent,
                              })
                            }
                            className="w-12 h-12 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                            style={{ backgroundColor: theme.primary }}
                            title={theme.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsColorDialogOpen(false)}
                    >
                      إلغاء
                    </Button>
                    <Button
                      onClick={saveSystemColors}
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      تطبيق الألوان
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* إدارة الأدوار والصلاحيات */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center justify-between">
                إدارة الأدوار
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingRole(null);
                    setNewRole({
                      name: "",
                      displayName: "",
                      description: "",
                      permissions: [],
                    });
                    setIsRoleDialogOpen(true);
                  }}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة دور
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold">{role.displayName}</h4>
                      <p className="text-sm text-gray-600">
                        {role.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {role.permissions.slice(0, 4).map((permission) => (
                          <span
                            key={permission}
                            className="px-1 py-0.5 bg-purple-100 text-purple-800 text-xs rounded"
                          >
                            {getPermissionDisplayName(permission)}
                          </span>
                        ))}
                        {role.permissions.length > 4 && (
                          <span className="px-1 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                            +{role.permissions.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          role.isCustom
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {role.isCustom ? "مخصص" : "افتراضي"}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditRole(role)}
                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                        title="تعديل الدور"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {role.isCustom && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteRole(role.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          title="حذف الدور"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center justify-between">
                الصلاحيات المتاحة
                <Button
                  size="sm"
                  onClick={() => setIsPermissionDialogOpen(true)}
                  className="bg-indigo-500 hover:bg-indigo-600"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  مراجعة الصلاحيات
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(
                  permissions.reduce(
                    (acc, permission) => {
                      if (!acc[permission.category]) {
                        acc[permission.category] = [];
                      }
                      acc[permission.category].push(permission);
                      return acc;
                    },
                    {} as Record<string, Permission[]>,
                  ),
                ).map(([category, categoryPermissions]) => (
                  <div key={category}>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {category}
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {categoryPermissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded"
                        >
                          <div>
                            <span className="font-medium text-sm">
                              {permission.displayName}
                            </span>
                            <p className="text-xs text-gray-500">
                              {permission.description}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded">
                            {permission.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* نظام النسخ الاحتياطي */}
        <Card className="bg-white shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-500"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14,2 14,8 20,8" />
                <path d="M12 18v-6" />
                <path d="m9 15 3 3 3-3" />
              </svg>
              نظام النسخ الاحتياطي والاستعادة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">
                  إنشاء نسخة احتياطية
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="checkbox"
                      id="backup-sales"
                      className="ml-2"
                      defaultChecked
                    />
                    <label htmlFor="backup-sales">بيانات المبيعات</label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="checkbox"
                      id="backup-purchases"
                      className="ml-2"
                      defaultChecked
                    />
                    <label htmlFor="backup-purchases">بيانات المشتريات</label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="checkbox"
                      id="backup-customers"
                      className="ml-2"
                      defaultChecked
                    />
                    <label htmlFor="backup-customers">بيانات العملاء</label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="checkbox"
                      id="backup-suppliers"
                      className="ml-2"
                      defaultChecked
                    />
                    <label htmlFor="backup-suppliers">بيانات الموردين</label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="checkbox"
                      id="backup-inventory"
                      className="ml-2"
                      defaultChecked
                    />
                    <label htmlFor="backup-inventory">بيانات المخزون</label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="checkbox"
                      id="backup-accounts"
                      className="ml-2"
                      defaultChecked
                    />
                    <label htmlFor="backup-accounts">البيانات المحاسبية</label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={createBackup}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    إنشاء نسخة احتياطية
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setSystemSettings({
                        ...systemSettings,
                        autoBackup: !systemSettings.autoBackup,
                      })
                    }
                  >
                    {systemSettings.autoBackup ? "إيقاف" : "تفعيل"} النسخ
                    التلقائية
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">
                  استعادة البيانات
                </h4>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-auto mb-4 text-gray-400"
                  >
                    <path d="M21 15v4a2 2 0 0 0-4 2H5a2 2 0 0 0-4 2v4" />
                    <polyline points="7,10 12,15 17,10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                  <p className="text-gray-600 mb-4">
                    اسحب ملف النسخة الاحتياطية هنا أو
                  </p>
                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleRestoreBackup}
                    className="hidden"
                    id="backup-restore"
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      document.getElementById("backup-restore")?.click()
                    }
                  >
                    اختر ملف
                  </Button>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">حالة النسخ الاحتياطي:</h5>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="flex items-center justify-between">
                      <span>النسخ الاحتياطي التلقائي</span>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          systemSettings.autoBackup
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {systemSettings.autoBackup ? "مفعل" : "معطل"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      آخر نسخة احتياطية:{" "}
                      {new Date().toLocaleDateString("ar-SA")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* قائمة المستخدمين */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center justify-between">
              قائمة المستخدمين
              <Button
                size="sm"
                onClick={() => {
                  setEditingUser(null);
                  setNewUser({
                    name: "",
                    email: "",
                    role: "",
                    password: "",
                    permissions: [],
                  });
                  setIsUserDialogOpen(true);
                }}
                className="bg-green-500 hover:bg-green-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                إضافة مستخدم
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {user.name}
                        </h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {getRoleDisplayName(user.role)}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              user.status === "نشط"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {user.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditUser(user)}
                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                      title="تعديل المستخدم"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedUserForPermissions(user);
                        setNewUser({
                          ...newUser,
                          permissions: user.permissions || [],
                        });
                        setIsUserPermissionDialogOpen(true);
                      }}
                      className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700"
                      title="إدارة الصلاحيات"
                    >
                      <Shield className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedUserForPassword(user);
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                        setIsPasswordDialogOpen(true);
                      }}
                      className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700"
                      title="تغيير كلمة المرور"
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
                        <rect
                          width="18"
                          height="11"
                          x="3"
                          y="11"
                          rx="2"
                          ry="2"
                        />
                        <circle cx="12" cy="5" r="2" />
                        <path d="m12 7-8.5 9" />
                        <path d="m12 7 8.5 9" />
                      </svg>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteUser(user.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      title="حذف المستخدم"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dialog لإدارة صلاحيات المستخدم */}
        <Dialog
          open={isUserPermissionDialogOpen}
          onOpenChange={setIsUserPermissionDialogOpen}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                إدارة صلاحيات المستخدم: {selectedUserForPermissions?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                  الدور الحالي:{" "}
                  {selectedUserForPermissions
                    ? getRoleDisplayName(selectedUserForPermissions.role)
                    : ""}
                </h4>
                <div className="flex flex-wrap gap-1">
                  {selectedUserForPermissions &&
                    roles
                      .find((r) => r.name === selectedUserForPermissions.role)
                      ?.permissions.map((permission) => (
                        <span
                          key={permission}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {getPermissionDisplayName(permission)} (من الدور)
                        </span>
                      ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>صلاحيات إضافية</Label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded p-3">
                  {permissions.map((permission) => {
                    const rolePermissions = selectedUserForPermissions
                      ? roles.find(
                          (r) => r.name === selectedUserForPermissions.role,
                        )?.permissions || []
                      : [];
                    const isRolePermission = rolePermissions.includes(
                      permission.name,
                    );
                    const isAdditionalPermission =
                      newUser.permissions.includes(permission.name) &&
                      !isRolePermission;

                    return (
                      <label
                        key={permission.id}
                        className="flex items-center space-x-2 space-x-reverse"
                      >
                        <input
                          type="checkbox"
                          checked={isRolePermission || isAdditionalPermission}
                          disabled={isRolePermission}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewUser({
                                ...newUser,
                                permissions: [
                                  ...newUser.permissions,
                                  permission.name,
                                ],
                              });
                            } else {
                              setNewUser({
                                ...newUser,
                                permissions: newUser.permissions.filter(
                                  (p) => p !== permission.name,
                                ),
                              });
                            }
                          }}
                          className="ml-2"
                        />
                        <div>
                          <span
                            className={`text-sm ${isRolePermission ? "text-gray-500" : ""}`}
                          >
                            {permission.displayName}
                            {isRolePermission && " (من الدور)"}
                          </span>
                          <p className="text-xs text-gray-500">
                            {permission.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsUserPermissionDialogOpen(false);
                  setSelectedUserForPermissions(null);
                  setNewUser({
                    name: "",
                    email: "",
                    role: "",
                    password: "",
                    permissions: [],
                  });
                }}
              >
                إلغاء
              </Button>
              <Button
                onClick={handleUpdateUserPermissions}
                className="bg-blue-500 hover:bg-blue-600"
              >
                حفظ الصلاحيات
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog لتغيير كلمة المرور */}
        <Dialog
          open={isPasswordDialogOpen}
          onOpenChange={setIsPasswordDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                تغيير كلمة المرور: {selectedUserForPassword?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>كلمة المرور الجديدة</Label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="أدخل كلمة المرور الجديدة"
                />
              </div>
              <div className="space-y-2">
                <Label>تأكيد كلمة المرور</Label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="أعد إدخال كلمة المرور الجديدة"
                />
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>ملاحظة:</strong> كلمة المرور يجب أن تكون 6 أحرف على
                  الأقل
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsPasswordDialogOpen(false);
                  setSelectedUserForPassword(null);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
              >
                إلغاء
              </Button>
              <Button
                onClick={handleChangePassword}
                className="bg-orange-500 hover:bg-orange-600"
              >
                تغيير كلمة المرور
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog لمراجعة الصلاحيات */}
        <Dialog
          open={isPermissionDialogOpen}
          onOpenChange={setIsPermissionDialogOpen}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>مراجعة الصلاحيات والوصول</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">
                    الأدوار والصلاحيات
                  </h4>
                  <div className="space-y-3">
                    {roles.map((role) => (
                      <div key={role.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium">{role.displayName}</h5>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              role.isCustom
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {role.isCustom ? "مخصص" : "افتراضي"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {role.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.map((permission) => (
                            <span
                              key={permission}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                            >
                              {getPermissionDisplayName(permission)}
                            </span>
                          ))}
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          المستخدمون:{" "}
                          {users.filter((u) => u.role === role.name).length}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">
                    المستخدمون والوصول
                  </h4>
                  <div className="space-y-3">
                    {users.map((user) => (
                      <div key={user.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium">{user.name}</h5>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              user.status === "نشط"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {user.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-600 mb-2">
                          الدور: {getRoleDisplayName(user.role)}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {user.permissions?.map((permission) => (
                            <span
                              key={permission}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                            >
                              {getPermissionDisplayName(permission)}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500">
                          تاريخ الإنشاء:{" "}
                          {new Date(user.createdAt).toLocaleDateString("ar-SA")}
                          {user.lastLogin && (
                            <span className="mr-2">
                              آخر دخول:{" "}
                              {new Date(user.lastLogin).toLocaleDateString(
                                "ar-SA",
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => setIsPermissionDialogOpen(false)}
                className="bg-indigo-500 hover:bg-indigo-600"
              >
                إغلاق
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Settings;
