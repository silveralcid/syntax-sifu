"use client";
import { useEffect, useState } from "react";

interface Category {
  category: string;
  count: number;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0 && data[0].category) {
          setCategories(data as Category[]);
        } else {
          console.error("Unexpected categories format:", data);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">Syntax Sifu 🥋</h1>
      <h2 className="mt-4">Available Categories:</h2>
      <ul className="list-disc pl-6">
        {categories.map((c) => (
          <li key={c.category}>
            {c.category} ({c.count})
          </li>
        ))}
      </ul>
    </main>
  );
}
