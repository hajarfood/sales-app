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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NavigationBar from "@/components/dashboard/NavigationBar";
import {
  Calculator,
  Plus,
  CreditCard,
  Wallet,
  Edit,
  Save,
  Trash2,
  Link,
  Users,
  UserCog,
  Eye,
  FileText,
} from "lucide-react";
import { useForm } from "react-hook-form";
import CentralSystem, { Account } from "@/services/CentralSystem";

interface JournalEntry {
  id?: string;
  date: string;
  reference: string;
  description: string;
  entries: JournalEntryLine[];
  createdAt?: string;
}

interface JournalEntryLine {
  accountId: string;
  description: string;
  debit: number;
  credit: number;
}

const Accounting = () => {
  const [isNewAccountOpen, setIsNewAccountOpen] = useState(false);
  const [isEditAccountOpen, setIsEditAccountOpen] = useState(false);
  const [isJournalEntryOpen, setIsJournalEntryOpen] = useState(false);
  const [isViewJournalEntryOpen, setIsViewJournalEntryOpen] = useState(false);
  const [isEditJournalEntryOpen, setIsEditJournalEntryOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [selectedJournalEntry, setSelectedJournalEntry] =
    useState<JournalEntry | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [centralSystem] = useState(() => CentralSystem.getInstance());
  const [journalEntry, setJournalEntry] = useState<JournalEntry>({
    date: new Date().toISOString().split("T")[0],
    reference: `JE-${new Date().getFullYear()}-${String(1).padStart(4, "0")}`,
    description: "",
    entries: [],
  });

  // Update journal entry reference when component mounts
  useEffect(() => {
    const existingEntries = JSON.parse(
      localStorage.getItem("journal_entries") || "[]",
    );
    const nextEntryNumber = existingEntries.length + 1;
    setJournalEntry((prev) => ({
      ...prev,
      reference: `JE-${new Date().getFullYear()}-${String(nextEntryNumber).padStart(4, "0")}`,
    }));
  }, []);

  const form = useForm({
    defaultValues: {
      code: "",
      name: "",
      type: "",
      parentId: "",
      balance: 0,
    },
  });

  // Load accounts from central system with better initialization
  useEffect(() => {
    const loadAccounts = () => {
      console.log("loadAccounts function called");
      const systemAccounts = centralSystem.getAccounts();
      console.log(
        "Loading accounts from CentralSystem:",
        systemAccounts.length,
      );
      setAccounts(systemAccounts);

      // If still no accounts after multiple attempts, force initialization
      if (systemAccounts.length === 0) {
        console.log("No accounts found, forcing initialization");
        // Force a complete re-initialization
        setTimeout(() => {
          const freshAccounts = centralSystem.getAccounts();
          console.log(
            "Fresh accounts after forced init:",
            freshAccounts.length,
          );
          setAccounts(freshAccounts);
        }, 100);
      }
    };

    // Initial load
    console.log("Starting initial account load");
    loadAccounts();

    // Add listener for updates
    centralSystem.addListener(loadAccounts);

    // Force reload after short delays to ensure initialization
    const timer1 = setTimeout(() => {
      console.log("Timer 1 - reloading accounts");
      loadAccounts();
    }, 50);

    const timer2 = setTimeout(() => {
      console.log("Timer 2 - reloading accounts");
      loadAccounts();
    }, 200);

    const timer3 = setTimeout(() => {
      console.log("Timer 3 - reloading accounts");
      loadAccounts();
    }, 500);

    const timer4 = setTimeout(() => {
      console.log("Timer 4 - final reload attempt");
      loadAccounts();
    }, 1000);

    return () => {
      centralSystem.removeListener(loadAccounts);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [centralSystem]);

  // Load journal entries
  useEffect(() => {
    const loadJournalEntries = () => {
      const savedEntries = localStorage.getItem("journal_entries");
      if (savedEntries) {
        try {
          const entries = JSON.parse(savedEntries);
          setJournalEntries(entries);
        } catch (error) {
          console.error("Error loading journal entries:", error);
          setJournalEntries([]);
        }
      }
    };

    loadJournalEntries();
  }, []);

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderAccountTree = (accounts: Account[], level = 0) => {
    return accounts.map((account) => (
      <div key={account.id} className="mb-1">
        <div
          className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-50 ${
            level > 0 ? `ml-${level * 4}` : ""
          }`}
          style={{ marginRight: `${level * 20}px` }}
        >
          <div className="flex items-center gap-2">
            {account.children && account.children.length > 0 && (
              <button
                onClick={() => toggleNode(account.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                {expandedNodes.has(account.id) ? "▼" : "▶"}
              </button>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {account.code} - {account.name}
              </span>
              {account.isSystemGenerated && (
                <div className="flex items-center gap-1">
                  <Link className="h-3 w-3 text-blue-500" />
                  {account.linkedEntityType === "customer" && (
                    <Users className="h-3 w-3 text-green-500" />
                  )}
                  {account.linkedEntityType === "supplier" && (
                    <UserCog className="h-3 w-3 text-purple-500" />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-bold ${
                account.type === "assets"
                  ? "text-green-600"
                  : account.type === "liabilities"
                    ? "text-red-600"
                    : account.type === "revenue"
                      ? "text-blue-600"
                      : "text-orange-600"
              }`}
            >
              {account.balance.toLocaleString()} ر.س
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleEditAccount(account)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDeleteAccount(account.id)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
        {account.children &&
          expandedNodes.has(account.id) &&
          renderAccountTree(account.children, level + 1)}
      </div>
    ));
  };

  const handleCreateAccount = async (data: any) => {
    try {
      const accountData = {
        code: data.code,
        name: data.name,
        type: data.type,
        parentId:
          data.parentId && data.parentId !== "none" ? data.parentId : undefined,
        balance: data.balance || 0,
      };

      await centralSystem.addAccount(accountData);
      form.reset();
      setIsNewAccountOpen(false);

      // Force reload accounts
      const updatedAccounts = centralSystem.getAccounts();
      setAccounts(updatedAccounts);
    } catch (error) {
      console.error("Error creating account:", error);
      alert("حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.");
    }
  };

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    form.reset({
      code: account.code,
      name: account.name,
      type: account.type,
      parentId: account.parentId || "none",
      balance: account.balance,
    });
    setIsEditAccountOpen(true);
  };

  const handleUpdateAccount = async (data: any) => {
    if (!selectedAccount) return;

    try {
      const updates = {
        code: data.code,
        name: data.name,
        type: data.type,
        balance: data.balance,
      };

      await centralSystem.updateAccount(selectedAccount.id, updates);
      setIsEditAccountOpen(false);
      setSelectedAccount(null);

      // Force reload accounts
      const updatedAccounts = centralSystem.getAccounts();
      setAccounts(updatedAccounts);
    } catch (error) {
      console.error("Error updating account:", error);
      alert("حدث خطأ أثناء تحديث الحساب. يرجى المحاولة مرة أخرى.");
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الحساب؟")) {
      try {
        await centralSystem.deleteAccount(accountId);

        // Force reload accounts
        const updatedAccounts = centralSystem.getAccounts();
        setAccounts(updatedAccounts);
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("حدث خطأ أثناء حذف الحساب. يرجى المحاولة مرة أخرى.");
      }
    }
  };

  const flatAccounts = centralSystem.getAllAccountsFlat();

  const addJournalEntryLine = () => {
    setJournalEntry({
      ...journalEntry,
      entries: [
        ...journalEntry.entries,
        {
          accountId: "",
          description: "",
          debit: 0,
          credit: 0,
        },
      ],
    });
  };

  const removeJournalEntryLine = (index: number) => {
    setJournalEntry({
      ...journalEntry,
      entries: journalEntry.entries.filter((_, i) => i !== index),
    });
  };

  const updateJournalEntryLine = (
    index: number,
    updates: Partial<JournalEntryLine>,
  ) => {
    const updatedEntries = journalEntry.entries.map((entry, i) =>
      i === index ? { ...entry, ...updates } : entry,
    );
    setJournalEntry({
      ...journalEntry,
      entries: updatedEntries,
    });
  };

  const getTotalDebit = () => {
    return journalEntry.entries.reduce((sum, entry) => sum + entry.debit, 0);
  };

  const getTotalCredit = () => {
    return journalEntry.entries.reduce((sum, entry) => sum + entry.credit, 0);
  };

  const saveJournalEntry = () => {
    if (getTotalDebit() !== getTotalCredit()) {
      alert("إجمالي المدين يجب أن يساوي إجمالي الدائن");
      return;
    }

    if (journalEntry.entries.length === 0) {
      alert("يجب إضافة سطر واحد على الأقل");
      return;
    }

    // Generate automatic journal entry number
    const existingEntries = JSON.parse(
      localStorage.getItem("journal_entries") || "[]",
    );
    const entryCount = existingEntries.length + 1;
    const entryNumber = `JE-${new Date().getFullYear()}-${String(entryCount).padStart(4, "0")}`;

    const newEntry = {
      ...journalEntry,
      id: Date.now().toString(),
      reference: entryNumber,
      createdAt: new Date().toISOString(),
    };

    existingEntries.push(newEntry);
    localStorage.setItem("journal_entries", JSON.stringify(existingEntries));
    setJournalEntries(existingEntries);

    // Reset form
    setJournalEntry({
      date: new Date().toISOString().split("T")[0],
      reference: `JE-${new Date().getFullYear()}-${String(entryCount + 1).padStart(4, "0")}`,
      description: "",
      entries: [],
    });
    setIsJournalEntryOpen(false);
    alert(`تم حفظ القيد بنجاح برقم: ${entryNumber}`);
  };

  const updateJournalEntry = () => {
    if (!selectedJournalEntry) return;

    if (getTotalDebit() !== getTotalCredit()) {
      alert("إجمالي المدين يجب أن يساوي إجمالي الدائن");
      return;
    }

    if (journalEntry.entries.length === 0) {
      alert("يجب إضافة سطر واحد على الأقل");
      return;
    }

    const existingEntries = JSON.parse(
      localStorage.getItem("journal_entries") || "[]",
    );

    const updatedEntries = existingEntries.map((entry: JournalEntry) =>
      entry.id === selectedJournalEntry.id
        ? {
            ...journalEntry,
            id: selectedJournalEntry.id,
            createdAt: selectedJournalEntry.createdAt,
          }
        : entry,
    );

    localStorage.setItem("journal_entries", JSON.stringify(updatedEntries));
    setJournalEntries(updatedEntries);
    setIsEditJournalEntryOpen(false);
    setSelectedJournalEntry(null);
    alert("تم تحديث القيد بنجاح");
  };

  const deleteJournalEntry = (entryId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا القيد؟")) {
      const existingEntries = JSON.parse(
        localStorage.getItem("journal_entries") || "[]",
      );

      const updatedEntries = existingEntries.filter(
        (entry: JournalEntry) => entry.id !== entryId,
      );
      localStorage.setItem("journal_entries", JSON.stringify(updatedEntries));
      setJournalEntries(updatedEntries);
      alert("تم حذف القيد بنجاح");
    }
  };

  const viewJournalEntry = (entry: JournalEntry) => {
    setSelectedJournalEntry(entry);
    setIsViewJournalEntryOpen(true);
  };

  const editJournalEntry = (entry: JournalEntry) => {
    setSelectedJournalEntry(entry);
    setJournalEntry({
      date: entry.date,
      reference: entry.reference,
      description: entry.description,
      entries: entry.entries,
    });
    setIsEditJournalEntryOpen(true);
  };

  const getAccountName = (accountId: string) => {
    const allAccounts = centralSystem.getAllAccountsFlat();
    const account = allAccounts.find((acc) => acc.id === accountId);
    return account ? `${account.code} - ${account.name}` : "حساب غير موجود";
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
              <Calculator className="h-6 w-6" />
            </div>
            إدارة الحسابات
          </h1>
          <p className="text-gray-600">
            إدارة الحسابات المالية والمعاملات النقدية وقيود اليومية
          </p>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="accounts" className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="accounts" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              دليل الحسابات
            </TabsTrigger>
            <TabsTrigger value="journal" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              قيود اليومية
            </TabsTrigger>
          </TabsList>

          <TabsContent value="accounts" className="space-y-6">
            {/* دليل الحسابات الهرمي */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Calculator className="h-6 w-6 text-green-500" />
                    دليل الحسابات الهرمي المرتبط
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Link className="h-4 w-4" />
                      <span>مرتبط بالنظام المركزي</span>
                    </div>
                  </CardTitle>
                  <div className="flex gap-2">
                    <Dialog
                      open={isNewAccountOpen}
                      onOpenChange={setIsNewAccountOpen}
                    >
                      <DialogTrigger asChild>
                        <Button className="bg-green-500 hover:bg-green-600">
                          <Plus className="ml-2 h-4 w-4" />
                          إضافة حساب جديد
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>إضافة حساب جديد</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit(handleCreateAccount)}
                            className="space-y-4"
                          >
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>رقم الحساب</FormLabel>
                                    <FormControl>
                                      <Input placeholder="1001" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>اسم الحساب</FormLabel>
                                    <FormControl>
                                      <Input placeholder="النقدية" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>نوع الحساب</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      value={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="اختر نوع الحساب" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="assets">
                                          الأصول
                                        </SelectItem>
                                        <SelectItem value="liabilities">
                                          الخصوم
                                        </SelectItem>
                                        <SelectItem value="revenue">
                                          الإيرادات
                                        </SelectItem>
                                        <SelectItem value="expenses">
                                          المصروفات
                                        </SelectItem>
                                        <SelectItem value="equity">
                                          حقوق الملكية
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="parentId"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>الحساب الأب (اختياري)</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      value={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="اختر الحساب الأب" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="none">
                                          بدون حساب أب
                                        </SelectItem>
                                        {flatAccounts.map((account) => (
                                          <SelectItem
                                            key={account.id}
                                            value={account.id}
                                          >
                                            {account.code} - {account.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={form.control}
                              name="balance"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>الرصيد الابتدائي</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="0.00"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          parseFloat(e.target.value) || 0,
                                        )
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsNewAccountOpen(false)}
                              >
                                إلغاء
                              </Button>
                              <Button
                                type="submit"
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <Save className="ml-2 h-4 w-4" />
                                حفظ الحساب
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {accounts.length > 0 ? (
                    renderAccountTree(accounts)
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-500 mb-4">
                        <p>جاري تحميل دليل الحسابات...</p>
                        <p className="text-sm mt-2">
                          إذا لم تظهر الحسابات، اضغط على الزر أدناه
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => {
                            console.log("Force reload accounts clicked");

                            // Clear localStorage and force re-initialization
                            localStorage.removeItem("centralSystem_accounts");

                            // Get fresh accounts which will trigger initialization
                            const systemAccounts = centralSystem.getAccounts();
                            console.log(
                              "Available accounts after force reload:",
                              systemAccounts.length,
                            );
                            setAccounts(systemAccounts);

                            // If still no accounts, try one more time after a short delay
                            if (systemAccounts.length === 0) {
                              setTimeout(() => {
                                const retryAccounts =
                                  centralSystem.getAccounts();
                                console.log(
                                  "Retry accounts:",
                                  retryAccounts.length,
                                );
                                setAccounts(retryAccounts);
                              }, 200);
                            }
                          }}
                          variant="outline"
                          className="mt-2"
                        >
                          إعادة تحميل الحسابات
                        </Button>
                        <Button
                          onClick={() => {
                            console.log("Page reload requested");
                            window.location.reload();
                          }}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          إعادة تحميل الصفحة
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="journal" className="space-y-6">
            {/* قيود اليومية */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <FileText className="h-6 w-6 text-blue-500" />
                    قيود اليومية
                  </CardTitle>
                  <Dialog
                    open={isJournalEntryOpen}
                    onOpenChange={setIsJournalEntryOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                        <Plus className="ml-2 h-4 w-4" />
                        قيد يومية جديد
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>إنشاء قيد يومية جديد</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>التاريخ</Label>
                            <Input
                              type="date"
                              value={journalEntry.date}
                              onChange={(e) =>
                                setJournalEntry({
                                  ...journalEntry,
                                  date: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>رقم المرجع</Label>
                            <Input
                              value={journalEntry.reference}
                              onChange={(e) =>
                                setJournalEntry({
                                  ...journalEntry,
                                  reference: e.target.value,
                                })
                              }
                              placeholder="JE-001"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>الوصف</Label>
                          <Input
                            value={journalEntry.description}
                            onChange={(e) =>
                              setJournalEntry({
                                ...journalEntry,
                                description: e.target.value,
                              })
                            }
                            placeholder="وصف القيد"
                          />
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold">تفاصيل القيد</h4>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addJournalEntryLine}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              إضافة سطر
                            </Button>
                          </div>

                          <div className="border rounded-lg overflow-hidden">
                            <table className="w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="p-2 text-right border">
                                    الحساب
                                  </th>
                                  <th className="p-2 text-right border">
                                    البيان
                                  </th>
                                  <th className="p-2 text-right border">
                                    مدين
                                  </th>
                                  <th className="p-2 text-right border">
                                    دائن
                                  </th>
                                  <th className="p-2 text-center border">
                                    إجراءات
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {journalEntry.entries.map((entry, index) => (
                                  <tr key={index}>
                                    <td className="p-2 border">
                                      <Select
                                        value={entry.accountId}
                                        onValueChange={(value) =>
                                          updateJournalEntryLine(index, {
                                            accountId: value,
                                          })
                                        }
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="اختر الحساب" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {centralSystem
                                            .getAllAccountsFlat()
                                            .map((account) => (
                                              <SelectItem
                                                key={account.id}
                                                value={account.id}
                                              >
                                                {account.code} - {account.name}
                                              </SelectItem>
                                            ))}
                                        </SelectContent>
                                      </Select>
                                    </td>
                                    <td className="p-2 border">
                                      <Input
                                        value={entry.description}
                                        onChange={(e) =>
                                          updateJournalEntryLine(index, {
                                            description: e.target.value,
                                          })
                                        }
                                        placeholder="البيان"
                                      />
                                    </td>
                                    <td className="p-2 border">
                                      <Input
                                        type="number"
                                        step="0.01"
                                        value={entry.debit}
                                        onChange={(e) =>
                                          updateJournalEntryLine(index, {
                                            debit:
                                              parseFloat(e.target.value) || 0,
                                            credit: 0,
                                          })
                                        }
                                        placeholder="0.00"
                                      />
                                    </td>
                                    <td className="p-2 border">
                                      <Input
                                        type="number"
                                        step="0.01"
                                        value={entry.credit}
                                        onChange={(e) =>
                                          updateJournalEntryLine(index, {
                                            credit:
                                              parseFloat(e.target.value) || 0,
                                            debit: 0,
                                          })
                                        }
                                        placeholder="0.00"
                                      />
                                    </td>
                                    <td className="p-2 border text-center">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          removeJournalEntryLine(index)
                                        }
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot className="bg-gray-50">
                                <tr>
                                  <td
                                    colSpan={2}
                                    className="p-2 border font-semibold"
                                  >
                                    الإجمالي
                                  </td>
                                  <td className="p-2 border font-semibold">
                                    {getTotalDebit().toFixed(2)}
                                  </td>
                                  <td className="p-2 border font-semibold">
                                    {getTotalCredit().toFixed(2)}
                                  </td>
                                  <td className="p-2 border"></td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>

                          {getTotalDebit() !== getTotalCredit() && (
                            <div className="bg-red-50 border border-red-200 rounded p-3">
                              <p className="text-red-800 text-sm">
                                تحذير: إجمالي المدين لا يساوي إجمالي الدائن.
                                الفرق:{" "}
                                {Math.abs(
                                  getTotalDebit() - getTotalCredit(),
                                ).toFixed(2)}{" "}
                                ر.س
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsJournalEntryOpen(false)}
                        >
                          إلغاء
                        </Button>
                        <Button
                          onClick={saveJournalEntry}
                          disabled={
                            getTotalDebit() !== getTotalCredit() ||
                            journalEntry.entries.length === 0
                          }
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          <Save className="ml-2 h-4 w-4" />
                          حفظ القيد
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {journalEntries.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="p-3 text-right border">
                              رقم المرجع
                            </th>
                            <th className="p-3 text-right border">التاريخ</th>
                            <th className="p-3 text-right border">الوصف</th>
                            <th className="p-3 text-right border">المبلغ</th>
                            <th className="p-3 text-center border">
                              الإجراءات
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {journalEntries.map((entry) => {
                            const totalAmount = entry.entries.reduce(
                              (sum, line) => sum + line.debit,
                              0,
                            );
                            return (
                              <tr key={entry.id} className="hover:bg-gray-50">
                                <td className="p-3 border font-medium">
                                  {entry.reference}
                                </td>
                                <td className="p-3 border">{entry.date}</td>
                                <td className="p-3 border">
                                  {entry.description}
                                </td>
                                <td className="p-3 border font-semibold">
                                  {totalAmount.toFixed(2)} ر.س
                                </td>
                                <td className="p-3 border text-center">
                                  <div className="flex justify-center gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => viewJournalEntry(entry)}
                                      className="text-blue-600 hover:text-blue-700"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => editJournalEntry(entry)}
                                      className="text-green-600 hover:text-green-700"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        deleteJournalEntry(entry.id!)
                                      }
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">
                        لا توجد قيود يومية مسجلة
                      </p>
                      <p className="text-sm text-gray-400">
                        ابدأ بإنشاء قيد يومية جديد
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* نموذج تعديل الحساب */}
        <Dialog open={isEditAccountOpen} onOpenChange={setIsEditAccountOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تعديل الحساب</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleUpdateAccount)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الحساب</FormLabel>
                        <FormControl>
                          <Input placeholder="1001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم الحساب</FormLabel>
                        <FormControl>
                          <Input placeholder="النقدية" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نوع الحساب</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر نوع الحساب" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="assets">الأصول</SelectItem>
                            <SelectItem value="liabilities">الخصوم</SelectItem>
                            <SelectItem value="revenue">الإيرادات</SelectItem>
                            <SelectItem value="expenses">المصروفات</SelectItem>
                            <SelectItem value="equity">حقوق الملكية</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="balance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الرصيد</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditAccountOpen(false)}
                  >
                    إلغاء
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Save className="ml-2 h-4 w-4" />
                    حفظ التعديلات
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* View Journal Entry Dialog */}
        <Dialog
          open={isViewJournalEntryOpen}
          onOpenChange={setIsViewJournalEntryOpen}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                عرض قيد اليومية - {selectedJournalEntry?.reference}
              </DialogTitle>
            </DialogHeader>
            {selectedJournalEntry && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>التاريخ</Label>
                    <div className="p-2 bg-gray-50 rounded">
                      {selectedJournalEntry.date}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>رقم المرجع</Label>
                    <div className="p-2 bg-gray-50 rounded">
                      {selectedJournalEntry.reference}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>الوصف</Label>
                  <div className="p-2 bg-gray-50 rounded">
                    {selectedJournalEntry.description}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">تفاصيل القيد</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-2 text-right border">الحساب</th>
                          <th className="p-2 text-right border">البيان</th>
                          <th className="p-2 text-right border">مدين</th>
                          <th className="p-2 text-right border">دائن</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedJournalEntry.entries.map((entry, index) => (
                          <tr key={index}>
                            <td className="p-2 border">
                              {getAccountName(entry.accountId)}
                            </td>
                            <td className="p-2 border">{entry.description}</td>
                            <td className="p-2 border">
                              {entry.debit > 0 ? entry.debit.toFixed(2) : "-"}
                            </td>
                            <td className="p-2 border">
                              {entry.credit > 0 ? entry.credit.toFixed(2) : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={2} className="p-2 border font-semibold">
                            الإجمالي
                          </td>
                          <td className="p-2 border font-semibold">
                            {selectedJournalEntry.entries
                              .reduce((sum, entry) => sum + entry.debit, 0)
                              .toFixed(2)}
                          </td>
                          <td className="p-2 border font-semibold">
                            {selectedJournalEntry.entries
                              .reduce((sum, entry) => sum + entry.credit, 0)
                              .toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setIsViewJournalEntryOpen(false)}
              >
                إغلاق
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Journal Entry Dialog */}
        <Dialog
          open={isEditJournalEntryOpen}
          onOpenChange={setIsEditJournalEntryOpen}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                تعديل قيد اليومية - {selectedJournalEntry?.reference}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>التاريخ</Label>
                  <Input
                    type="date"
                    value={journalEntry.date}
                    onChange={(e) =>
                      setJournalEntry({
                        ...journalEntry,
                        date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>رقم المرجع</Label>
                  <Input
                    value={journalEntry.reference}
                    onChange={(e) =>
                      setJournalEntry({
                        ...journalEntry,
                        reference: e.target.value,
                      })
                    }
                    placeholder="JE-001"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Input
                  value={journalEntry.description}
                  onChange={(e) =>
                    setJournalEntry({
                      ...journalEntry,
                      description: e.target.value,
                    })
                  }
                  placeholder="وصف القيد"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">تفاصيل القيد</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addJournalEntryLine}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة سطر
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-2 text-right border">الحساب</th>
                        <th className="p-2 text-right border">البيان</th>
                        <th className="p-2 text-right border">مدين</th>
                        <th className="p-2 text-right border">دائن</th>
                        <th className="p-2 text-center border">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {journalEntry.entries.map((entry, index) => (
                        <tr key={index}>
                          <td className="p-2 border">
                            <Select
                              value={entry.accountId}
                              onValueChange={(value) =>
                                updateJournalEntryLine(index, {
                                  accountId: value,
                                })
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="اختر الحساب" />
                              </SelectTrigger>
                              <SelectContent>
                                {centralSystem
                                  .getAllAccountsFlat()
                                  .map((account) => (
                                    <SelectItem
                                      key={account.id}
                                      value={account.id}
                                    >
                                      {account.code} - {account.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-2 border">
                            <Input
                              value={entry.description}
                              onChange={(e) =>
                                updateJournalEntryLine(index, {
                                  description: e.target.value,
                                })
                              }
                              placeholder="البيان"
                            />
                          </td>
                          <td className="p-2 border">
                            <Input
                              type="number"
                              step="0.01"
                              value={entry.debit}
                              onChange={(e) =>
                                updateJournalEntryLine(index, {
                                  debit: parseFloat(e.target.value) || 0,
                                  credit: 0,
                                })
                              }
                              placeholder="0.00"
                            />
                          </td>
                          <td className="p-2 border">
                            <Input
                              type="number"
                              step="0.01"
                              value={entry.credit}
                              onChange={(e) =>
                                updateJournalEntryLine(index, {
                                  credit: parseFloat(e.target.value) || 0,
                                  debit: 0,
                                })
                              }
                              placeholder="0.00"
                            />
                          </td>
                          <td className="p-2 border text-center">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeJournalEntryLine(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={2} className="p-2 border font-semibold">
                          الإجمالي
                        </td>
                        <td className="p-2 border font-semibold">
                          {getTotalDebit().toFixed(2)}
                        </td>
                        <td className="p-2 border font-semibold">
                          {getTotalCredit().toFixed(2)}
                        </td>
                        <td className="p-2 border"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {getTotalDebit() !== getTotalCredit() && (
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-red-800 text-sm">
                      تحذير: إجمالي المدين لا يساوي إجمالي الدائن. الفرق:{" "}
                      {Math.abs(getTotalDebit() - getTotalCredit()).toFixed(2)}{" "}
                      ر.س
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditJournalEntryOpen(false);
                  setSelectedJournalEntry(null);
                }}
              >
                إلغاء
              </Button>
              <Button
                onClick={updateJournalEntry}
                disabled={
                  getTotalDebit() !== getTotalCredit() ||
                  journalEntry.entries.length === 0
                }
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Save className="ml-2 h-4 w-4" />
                حفظ التعديلات
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* معلومات النظام المركزي */}
        <Card className="bg-white shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Link className="h-6 w-6 text-blue-500" />
              معلومات النظام المركزي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">
                  {centralSystem.getCustomers().length}
                </p>
                <p className="text-sm text-gray-600">عملاء مرتبطين</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <UserCog className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">
                  {centralSystem.getSuppliers().length}
                </p>
                <p className="text-sm text-gray-600">موردين مرتبطين</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Calculator className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">
                  {flatAccounts.filter((acc) => acc.isSystemGenerated).length}
                </p>
                <p className="text-sm text-gray-600">حسابات مولدة تلقائياً</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>ملاحظة:</strong> عند إضافة عميل أو مورد جديد، سيتم إنشاء
                حساب مقابل له تلقائياً في دليل الحسابات تحت الحساب المناسب.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Accounting;
