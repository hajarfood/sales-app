import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) console.error("خطأ في جلب البيانات:", error.message);
      else setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 قائمة المنتجات</h2>
      <table border={1} cellPadding={8} style={{ width: "100%", marginTop: "10px" }}>
        <thead>
          <tr>
            <th>الاسم</th>
            <th>الكود (SKU)</th>
            <th>السعر</th>
            <th>المخزون</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.sku}</td>
                <td>{p.price}</td>
                <td>{p.stock}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>🚫 لا توجد منتجات</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
