// Central System for managing accounts, customers, and suppliers integration with Supabase
import { supabase } from "../contexts/AuthContext";

interface Account {
  id: string;
  code: string;
  name: string;
  type: "assets" | "liabilities" | "revenue" | "expenses" | "equity";
  parentId?: string;
  balance: number;
  children?: Account[];
  isSystemGenerated?: boolean;
  linkedEntityId?: string;
  linkedEntityType?: "customer" | "supplier";
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalPurchases: number;
  lastVisit: string;
}

interface Supplier {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalPurchases: number;
  lastOrder: string;
}

class CentralSystem {
  private static instance: CentralSystem;
  private accounts: Account[] = [];
  private customers: Customer[] = [];
  private suppliers: Supplier[] = [];
  private listeners: (() => void)[] = [];
  private companyId = "00000000-0000-0000-0000-000000000001"; // Default company ID

  private constructor() {
    this.initializeSystem();
  }

  static getInstance(): CentralSystem {
    if (!CentralSystem.instance) {
      CentralSystem.instance = new CentralSystem();
    }
    return CentralSystem.instance;
  }

  // Event listener system
  addListener(callback: () => void) {
    this.listeners.push(callback);
  }

  removeListener(callback: () => void) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  private notifyListeners() {
    this.listeners.forEach((callback) => callback());
  }

  // Initialize system with immediate data availability
  private async initializeSystem() {
    try {
      console.log("Starting system initialization");

      // Load from localStorage first for immediate display
      this.loadFromLocalStorage();
      console.log(
        "Loaded from localStorage, accounts count:",
        this.accounts.length,
      );

      // If no accounts exist, initialize defaults immediately
      if (this.accounts.length === 0) {
        console.log("No accounts found, initializing defaults");
        this.initializeDefaultAccounts();
        console.log(
          "Default accounts initialized, count:",
          this.accounts.length,
        );
      }

      // Notify listeners immediately
      this.notifyListeners();
      console.log("Listeners notified after initialization");

      // Then try to sync with Supabase in background
      setTimeout(() => {
        this.syncWithSupabase();
      }, 100);
    } catch (error) {
      console.error("Error initializing system:", error);
      // Ensure we have default accounts even if there's an error
      if (this.accounts.length === 0) {
        console.log(
          "Error occurred, initializing default accounts as fallback",
        );
        this.initializeDefaultAccounts();
        this.notifyListeners();
      }
    }
  }

  // Sync with Supabase in background
  private async syncWithSupabase() {
    try {
      await Promise.all([
        this.loadAccounts(),
        this.loadCustomers(),
        this.loadSuppliers(),
      ]);
    } catch (error) {
      console.error("Error syncing with Supabase:", error);
    }
  }

  private async loadAccounts() {
    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("company_id", this.companyId)
      .order("code");

    if (error) {
      console.error("Error loading accounts:", error);
      return;
    }

    // Convert flat data to hierarchical structure
    this.accounts = this.buildAccountTree(data || []);
    this.notifyListeners();
  }

  private async loadCustomers() {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("company_id", this.companyId);

      if (error) {
        console.error("Error loading customers:", error);
        return;
      }

      const supabaseCustomers = (data || []).map((customer) => ({
        id: customer.id,
        name: customer.name,
        phone: customer.phone || "",
        email: customer.email || "",
        totalPurchases: parseFloat(customer.total_purchases || "0"),
        lastVisit:
          customer.last_visit || new Date().toISOString().split("T")[0],
      }));

      // Merge with existing localStorage data
      const existingCustomers = this.customers;
      const mergedCustomers = [...existingCustomers];

      supabaseCustomers.forEach((supabaseCustomer) => {
        const existingIndex = mergedCustomers.findIndex(
          (c) => c.id === supabaseCustomer.id,
        );
        if (existingIndex === -1) {
          mergedCustomers.push(supabaseCustomer);
        }
      });

      this.customers = mergedCustomers;
      localStorage.setItem("customers", JSON.stringify(this.customers));
      this.notifyListeners();
    } catch (error) {
      console.error("Error in loadCustomers:", error);
    }
  }

  private async loadSuppliers() {
    try {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .eq("company_id", this.companyId);

      if (error) {
        console.error("Error loading suppliers:", error);
        return;
      }

      const supabaseSuppliers = (data || []).map((supplier) => ({
        id: supplier.id,
        name: supplier.name,
        phone: supplier.phone || "",
        email: supplier.email || "",
        totalPurchases: parseFloat(supplier.total_purchases || "0"),
        lastOrder:
          supplier.last_order || new Date().toISOString().split("T")[0],
      }));

      // Merge with existing localStorage data
      const existingSuppliers = this.suppliers;
      const mergedSuppliers = [...existingSuppliers];

      supabaseSuppliers.forEach((supabaseSupplier) => {
        const existingIndex = mergedSuppliers.findIndex(
          (s) => s.id === supabaseSupplier.id,
        );
        if (existingIndex === -1) {
          mergedSuppliers.push(supabaseSupplier);
        }
      });

      this.suppliers = mergedSuppliers;
      localStorage.setItem("suppliers", JSON.stringify(this.suppliers));
      this.notifyListeners();
    } catch (error) {
      console.error("Error in loadSuppliers:", error);
    }
  }

  private buildAccountTree(flatAccounts: any[]): Account[] {
    const accountMap = new Map();
    const rootAccounts: Account[] = [];

    // First pass: create all accounts
    flatAccounts.forEach((acc) => {
      const account: Account = {
        id: acc.id,
        code: acc.code,
        name: acc.name,
        type: acc.type,
        parentId: acc.parent_id,
        balance: parseFloat(acc.balance || "0"),
        isSystemGenerated: acc.is_system_generated || false,
        linkedEntityId: acc.linked_entity_id,
        linkedEntityType: acc.linked_entity_type,
        children: [],
      };
      accountMap.set(acc.id, account);
    });

    // Second pass: build hierarchy
    accountMap.forEach((account) => {
      if (account.parentId && accountMap.has(account.parentId)) {
        const parent = accountMap.get(account.parentId);
        parent.children.push(account);
      } else {
        rootAccounts.push(account);
      }
    });

    return rootAccounts;
  }

  // Load from localStorage with better error handling
  private loadFromLocalStorage() {
    try {
      const savedAccounts = localStorage.getItem("centralSystem_accounts");
      const savedCustomers = localStorage.getItem("customers");
      const savedSuppliers = localStorage.getItem("suppliers");

      if (savedAccounts) {
        try {
          const parsedAccounts = JSON.parse(savedAccounts);
          if (Array.isArray(parsedAccounts) && parsedAccounts.length > 0) {
            this.accounts = parsedAccounts;
            console.log(
              "Loaded accounts from localStorage:",
              this.accounts.length,
            );
          } else {
            console.log("Invalid or empty accounts in localStorage");
            this.accounts = [];
          }
        } catch (error) {
          console.error("Error parsing saved accounts:", error);
          this.accounts = [];
        }
      } else {
        console.log("No saved accounts found in localStorage");
        this.accounts = [];
      }

      if (savedCustomers) {
        try {
          this.customers = JSON.parse(savedCustomers);
        } catch (error) {
          console.error("Error parsing saved customers:", error);
          this.customers = [];
        }
      }

      if (savedSuppliers) {
        try {
          this.suppliers = JSON.parse(savedSuppliers);
        } catch (error) {
          console.error("Error parsing saved suppliers:", error);
          this.suppliers = [];
        }
      }
    } catch (error) {
      console.error("Error in loadFromLocalStorage:", error);
      this.accounts = [];
      this.customers = [];
      this.suppliers = [];
    }
  }

  // Save data to localStorage and notify listeners
  private async saveData() {
    try {
      // Save to localStorage immediately
      localStorage.setItem(
        "centralSystem_accounts",
        JSON.stringify(this.accounts),
      );
      localStorage.setItem("customers", JSON.stringify(this.customers));
      localStorage.setItem("suppliers", JSON.stringify(this.suppliers));

      console.log(
        "Data saved to localStorage. Accounts:",
        this.accounts.length,
      );

      // Notify listeners immediately after saving
      this.notifyListeners();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }

  // Initialize default chart of accounts
  private initializeDefaultAccounts() {
    console.log("Initializing default accounts");

    // Clear existing accounts first
    this.accounts = [];

    // Create the default chart of accounts
    this.accounts = [
      {
        id: "1",
        code: "1000",
        name: "الأصول",
        type: "assets",
        balance: 684100,
        children: [
          {
            id: "1.1",
            code: "1001",
            name: "النقدية",
            type: "assets",
            parentId: "1",
            balance: 125400,
          },
          {
            id: "1.2",
            code: "1002",
            name: "البنوك",
            type: "assets",
            parentId: "1",
            balance: 423800,
            children: [
              {
                id: "1.2.1",
                code: "1002001",
                name: "البنك الأهلي",
                type: "assets",
                parentId: "1.2",
                balance: 234500,
              },
              {
                id: "1.2.2",
                code: "1002002",
                name: "بنك الراجحي",
                type: "assets",
                parentId: "1.2",
                balance: 189300,
              },
            ],
          },
          {
            id: "1.3",
            code: "1101",
            name: "العملاء",
            type: "assets",
            parentId: "1",
            balance: 45600,
            children: [],
          },
          {
            id: "1.4",
            code: "1201",
            name: "المخزون",
            type: "assets",
            parentId: "1",
            balance: 89300,
          },
        ],
      },
      {
        id: "2",
        code: "2000",
        name: "الخصوم",
        type: "liabilities",
        balance: 56100,
        children: [
          {
            id: "2.1",
            code: "2001",
            name: "الموردين",
            type: "liabilities",
            parentId: "2",
            balance: 32400,
            children: [],
          },
          {
            id: "2.2",
            code: "2002",
            name: "مصروفات مستحقة",
            type: "liabilities",
            parentId: "2",
            balance: 15200,
          },
          {
            id: "2.3",
            code: "2003",
            name: "ضرائب مستحقة",
            type: "liabilities",
            parentId: "2",
            balance: 8500,
          },
        ],
      },
      {
        id: "4",
        code: "4000",
        name: "الإيرادات",
        type: "revenue",
        balance: 361400,
        children: [
          {
            id: "4.1",
            code: "4001",
            name: "مبيعات",
            type: "revenue",
            parentId: "4",
            balance: 345200,
          },
          {
            id: "4.2",
            code: "4002",
            name: "إيرادات أخرى",
            type: "revenue",
            parentId: "4",
            balance: 12800,
          },
          {
            id: "4.3",
            code: "4003",
            name: "خصومات مكتسبة",
            type: "revenue",
            parentId: "4",
            balance: 3400,
          },
        ],
      },
      {
        id: "5",
        code: "5000",
        name: "المصروفات",
        type: "expenses",
        balance: 298000,
        children: [
          {
            id: "5.1",
            code: "5001",
            name: "تكلفة البضاعة",
            type: "expenses",
            parentId: "5",
            balance: 234800,
          },
          {
            id: "5.2",
            code: "5002",
            name: "الرواتب",
            type: "expenses",
            parentId: "5",
            balance: 45000,
          },
          {
            id: "5.3",
            code: "5003",
            name: "الإيجار",
            type: "expenses",
            parentId: "5",
            balance: 15000,
          },
          {
            id: "5.4",
            code: "5004",
            name: "الكهرباء والماء",
            type: "expenses",
            parentId: "5",
            balance: 3200,
          },
        ],
      },
    ];

    console.log("Default accounts initialized:", this.accounts.length);

    // Force save to localStorage immediately
    try {
      localStorage.setItem(
        "centralSystem_accounts",
        JSON.stringify(this.accounts),
      );
      console.log("Default accounts saved to localStorage successfully");
    } catch (error) {
      console.error("Error saving default accounts to localStorage:", error);
    }

    // Notify listeners after initialization
    this.notifyListeners();
  }

  // Get accounts with fallback initialization
  getAccounts(): Account[] {
    console.log(
      "getAccounts called, current accounts count:",
      this.accounts.length,
    );

    // If no accounts are available, try to initialize them
    if (this.accounts.length === 0) {
      console.log("No accounts found in getAccounts, attempting to initialize");
      this.loadFromLocalStorage();

      if (this.accounts.length === 0) {
        console.log(
          "Still no accounts after localStorage load, initializing defaults",
        );
        this.initializeDefaultAccounts();
      }
    }

    return this.accounts;
  }

  async addAccount(account: Omit<Account, "id">): Promise<Account> {
    try {
      const { data, error } = await supabase
        .from("accounts")
        .insert({
          code: account.code,
          name: account.name,
          type: account.type,
          parent_id: account.parentId || null,
          balance: account.balance || 0,
          is_system_generated: account.isSystemGenerated || false,
          linked_entity_id: account.linkedEntityId || null,
          linked_entity_type: account.linkedEntityType || null,
          company_id: this.companyId,
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding account:", error);
        throw error;
      }

      const newAccount: Account = {
        id: data.id,
        code: data.code,
        name: data.name,
        type: data.type,
        parentId: data.parent_id,
        balance: parseFloat(data.balance || "0"),
        isSystemGenerated: data.is_system_generated,
        linkedEntityId: data.linked_entity_id,
        linkedEntityType: data.linked_entity_type,
        children: [],
      };

      // Update local cache
      if (account.parentId) {
        this.addAccountToParent(this.accounts, newAccount, account.parentId);
      } else {
        this.accounts.push(newAccount);
      }

      this.saveData();
      return newAccount;
    } catch (error) {
      console.error("Error in addAccount:", error);
      // Fallback to local storage
      const newAccount: Account = {
        ...account,
        id: Date.now().toString(),
      };

      if (account.parentId) {
        this.addAccountToParent(this.accounts, newAccount, account.parentId);
      } else {
        this.accounts.push(newAccount);
      }

      this.saveData();
      return newAccount;
    }
  }

  private addAccountToParent(
    accounts: Account[],
    newAccount: Account,
    parentId: string,
  ): boolean {
    for (const account of accounts) {
      if (account.id === parentId) {
        if (!account.children) {
          account.children = [];
        }
        account.children.push(newAccount);
        return true;
      }
      if (
        account.children &&
        this.addAccountToParent(account.children, newAccount, parentId)
      ) {
        return true;
      }
    }
    return false;
  }

  async updateAccount(
    accountId: string,
    updates: Partial<Account>,
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("accounts")
        .update({
          code: updates.code,
          name: updates.name,
          type: updates.type,
          balance: updates.balance,
        })
        .eq("id", accountId);

      if (error) {
        console.error("Error updating account:", error);
        throw error;
      }

      // Update local cache
      const updated = this.updateAccountInTree(
        this.accounts,
        accountId,
        updates,
      );
      if (updated) {
        this.saveData();
      }
      return updated;
    } catch (error) {
      console.error("Error in updateAccount:", error);
      // Fallback to local update
      const updated = this.updateAccountInTree(
        this.accounts,
        accountId,
        updates,
      );
      if (updated) {
        this.saveData();
      }
      return updated;
    }
  }

  private updateAccountInTree(
    accounts: Account[],
    accountId: string,
    updates: Partial<Account>,
  ): boolean {
    for (const account of accounts) {
      if (account.id === accountId) {
        Object.assign(account, updates);
        return true;
      }
      if (
        account.children &&
        this.updateAccountInTree(account.children, accountId, updates)
      ) {
        return true;
      }
    }
    return false;
  }

  async deleteAccount(accountId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("accounts")
        .delete()
        .eq("id", accountId);

      if (error) {
        console.error("Error deleting account:", error);
        throw error;
      }

      // Update local cache
      const deleted = this.deleteAccountFromTree(this.accounts, accountId);
      if (deleted) {
        this.saveData();
      }
      return deleted;
    } catch (error) {
      console.error("Error in deleteAccount:", error);
      // Fallback to local delete
      const deleted = this.deleteAccountFromTree(this.accounts, accountId);
      if (deleted) {
        this.saveData();
      }
      return deleted;
    }
  }

  private deleteAccountFromTree(
    accounts: Account[],
    accountId: string,
  ): boolean {
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].id === accountId) {
        accounts.splice(i, 1);
        return true;
      }
      if (
        accounts[i].children &&
        this.deleteAccountFromTree(accounts[i].children!, accountId)
      ) {
        return true;
      }
    }
    return false;
  }

  // Customer management with automatic account creation
  async addCustomer(customer: Omit<Customer, "id">): Promise<Customer> {
    try {
      const { data, error } = await supabase
        .from("customers")
        .insert({
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          total_purchases: 0,
          last_visit: new Date().toISOString().split("T")[0],
          company_id: this.companyId,
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding customer:", error);
        throw error;
      }

      const newCustomer: Customer = {
        id: data.id,
        name: data.name,
        phone: data.phone || "",
        email: data.email || "",
        totalPurchases: parseFloat(data.total_purchases || "0"),
        lastVisit: data.last_visit || new Date().toISOString().split("T")[0],
      };

      this.customers.push(newCustomer);

      // Automatically create customer account under "العملاء"
      await this.createCustomerAccount(newCustomer);

      // Force save to localStorage immediately
      localStorage.setItem("customers", JSON.stringify(this.customers));
      this.notifyListeners();
      return newCustomer;
    } catch (error) {
      console.error("Error in addCustomer:", error);
      // Fallback to local storage
      const newCustomer: Customer = {
        ...customer,
        id: `C${Date.now()}`,
        totalPurchases: 0,
        lastVisit: new Date().toISOString().split("T")[0],
      };

      this.customers.push(newCustomer);
      await this.createCustomerAccount(newCustomer);

      // Force save to localStorage immediately
      localStorage.setItem("customers", JSON.stringify(this.customers));
      this.notifyListeners();
      return newCustomer;
    }
  }

  private async createCustomerAccount(customer: Customer) {
    // Find the "العملاء" parent account
    const customersParentAccount = this.findAccountByName("العملاء");
    if (customersParentAccount) {
      const customerAccount: Omit<Account, "id"> = {
        code: `1101${customer.id.substring(customer.id.length - 6)}`,
        name: customer.name,
        type: "assets",
        parentId: customersParentAccount.id,
        balance: 0,
        isSystemGenerated: true,
        linkedEntityId: customer.id,
        linkedEntityType: "customer",
      };

      await this.addAccount(customerAccount);
    }
  }

  // Supplier management with automatic account creation
  async addSupplier(supplier: Omit<Supplier, "id">): Promise<Supplier> {
    try {
      const { data, error } = await supabase
        .from("suppliers")
        .insert({
          name: supplier.name,
          phone: supplier.phone,
          email: supplier.email,
          total_purchases: 0,
          last_order: new Date().toISOString().split("T")[0],
          company_id: this.companyId,
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding supplier:", error);
        throw error;
      }

      const newSupplier: Supplier = {
        id: data.id,
        name: data.name,
        phone: data.phone || "",
        email: data.email || "",
        totalPurchases: parseFloat(data.total_purchases || "0"),
        lastOrder: data.last_order || new Date().toISOString().split("T")[0],
      };

      this.suppliers.push(newSupplier);

      // Automatically create supplier account under "الموردين"
      await this.createSupplierAccount(newSupplier);

      // Force save to localStorage immediately
      localStorage.setItem("suppliers", JSON.stringify(this.suppliers));
      this.notifyListeners();
      return newSupplier;
    } catch (error) {
      console.error("Error in addSupplier:", error);
      // Fallback to local storage
      const newSupplier: Supplier = {
        ...supplier,
        id: `S${Date.now()}`,
        totalPurchases: 0,
        lastOrder: new Date().toISOString().split("T")[0],
      };

      this.suppliers.push(newSupplier);
      await this.createSupplierAccount(newSupplier);

      // Force save to localStorage immediately
      localStorage.setItem("suppliers", JSON.stringify(this.suppliers));
      this.notifyListeners();
      return newSupplier;
    }
  }

  private async createSupplierAccount(supplier: Supplier) {
    // Find the "الموردين" parent account
    const suppliersParentAccount = this.findAccountByName("الموردين");
    if (suppliersParentAccount) {
      const supplierAccount: Omit<Account, "id"> = {
        code: `2001${supplier.id.substring(supplier.id.length - 6)}`,
        name: supplier.name,
        type: "liabilities",
        parentId: suppliersParentAccount.id,
        balance: 0,
        isSystemGenerated: true,
        linkedEntityId: supplier.id,
        linkedEntityType: "supplier",
      };

      await this.addAccount(supplierAccount);
    }
  }

  private findAccountByName(name: string): Account | null {
    return this.findAccountInTree(
      this.accounts,
      (account) => account.name === name,
    );
  }

  private findAccountInTree(
    accounts: Account[],
    predicate: (account: Account) => boolean,
  ): Account | null {
    for (const account of accounts) {
      if (predicate(account)) {
        return account;
      }
      if (account.children) {
        const found = this.findAccountInTree(account.children, predicate);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  // Get customers and suppliers
  getCustomers(): Customer[] {
    return this.customers;
  }

  getSuppliers(): Supplier[] {
    return this.suppliers;
  }

  // Update customer/supplier and sync with accounts
  async updateCustomer(
    customerId: string,
    updates: Partial<Customer>,
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("customers")
        .update({
          name: updates.name,
          phone: updates.phone,
          email: updates.email,
          total_purchases: updates.totalPurchases,
          last_visit: updates.lastVisit,
        })
        .eq("id", customerId);

      if (error) {
        console.error("Error updating customer:", error);
        throw error;
      }

      // Update local cache
      const customerIndex = this.customers.findIndex(
        (c) => c.id === customerId,
      );
      if (customerIndex !== -1) {
        Object.assign(this.customers[customerIndex], updates);

        // Update linked account name if customer name changed
        if (updates.name) {
          const linkedAccount = this.findAccountInTree(
            this.accounts,
            (account) =>
              account.linkedEntityId === customerId &&
              account.linkedEntityType === "customer",
          );
          if (linkedAccount) {
            await this.updateAccount(linkedAccount.id, { name: updates.name });
          }
        }

        this.saveData();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error in updateCustomer:", error);
      // Fallback to local update
      const customerIndex = this.customers.findIndex(
        (c) => c.id === customerId,
      );
      if (customerIndex !== -1) {
        Object.assign(this.customers[customerIndex], updates);
        this.saveData();
        return true;
      }
      return false;
    }
  }

  async updateSupplier(
    supplierId: string,
    updates: Partial<Supplier>,
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("suppliers")
        .update({
          name: updates.name,
          phone: updates.phone,
          email: updates.email,
          total_purchases: updates.totalPurchases,
          last_order: updates.lastOrder,
        })
        .eq("id", supplierId);

      if (error) {
        console.error("Error updating supplier:", error);
        throw error;
      }

      // Update local cache
      const supplierIndex = this.suppliers.findIndex(
        (s) => s.id === supplierId,
      );
      if (supplierIndex !== -1) {
        Object.assign(this.suppliers[supplierIndex], updates);

        // Update linked account name if supplier name changed
        if (updates.name) {
          const linkedAccount = this.findAccountInTree(
            this.accounts,
            (account) =>
              account.linkedEntityId === supplierId &&
              account.linkedEntityType === "supplier",
          );
          if (linkedAccount) {
            await this.updateAccount(linkedAccount.id, { name: updates.name });
          }
        }

        this.saveData();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error in updateSupplier:", error);
      // Fallback to local update
      const supplierIndex = this.suppliers.findIndex(
        (s) => s.id === supplierId,
      );
      if (supplierIndex !== -1) {
        Object.assign(this.suppliers[supplierIndex], updates);
        this.saveData();
        return true;
      }
      return false;
    }
  }

  // Delete customer/supplier and linked accounts
  async deleteCustomer(customerId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id", customerId);

      if (error) {
        console.error("Error deleting customer:", error);
        throw error;
      }

      // Update local cache
      const customerIndex = this.customers.findIndex(
        (c) => c.id === customerId,
      );
      if (customerIndex !== -1) {
        this.customers.splice(customerIndex, 1);

        // Delete linked account
        const linkedAccount = this.findAccountInTree(
          this.accounts,
          (account) =>
            account.linkedEntityId === customerId &&
            account.linkedEntityType === "customer",
        );
        if (linkedAccount) {
          await this.deleteAccount(linkedAccount.id);
        }

        this.saveData();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error in deleteCustomer:", error);
      // Fallback to local delete
      const customerIndex = this.customers.findIndex(
        (c) => c.id === customerId,
      );
      if (customerIndex !== -1) {
        this.customers.splice(customerIndex, 1);
        this.saveData();
        return true;
      }
      return false;
    }
  }

  async deleteSupplier(supplierId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("suppliers")
        .delete()
        .eq("id", supplierId);

      if (error) {
        console.error("Error deleting supplier:", error);
        throw error;
      }

      // Update local cache
      const supplierIndex = this.suppliers.findIndex(
        (s) => s.id === supplierId,
      );
      if (supplierIndex !== -1) {
        this.suppliers.splice(supplierIndex, 1);

        // Delete linked account
        const linkedAccount = this.findAccountInTree(
          this.accounts,
          (account) =>
            account.linkedEntityId === supplierId &&
            account.linkedEntityType === "supplier",
        );
        if (linkedAccount) {
          await this.deleteAccount(linkedAccount.id);
        }

        this.saveData();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error in deleteSupplier:", error);
      // Fallback to local delete
      const supplierIndex = this.suppliers.findIndex(
        (s) => s.id === supplierId,
      );
      if (supplierIndex !== -1) {
        this.suppliers.splice(supplierIndex, 1);
        this.saveData();
        return true;
      }
      return false;
    }
  }

  // Get all accounts in flat structure for dropdowns
  getAllAccountsFlat(): Account[] {
    const result: Account[] = [];
    const flatten = (accounts: Account[]) => {
      accounts.forEach((account) => {
        result.push(account);
        if (account.children) {
          flatten(account.children);
        }
      });
    };
    flatten(this.accounts);
    return result;
  }
}

export default CentralSystem;
export type { Account, Customer, Supplier };
