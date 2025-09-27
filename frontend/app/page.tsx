"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
      .then((res) => res.json())
      .then((data) => {
        // handle both array or object response
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data.categories) {
          setCategories(data.categories);
        } else {
          console.error("Unexpected categories format:", data);
        }
      });
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">Syntax Sifu 🥋</h1>
      <h2 className="mt-4">Available Categories:</h2>
      <ul className="list-disc pl-6">
        {categories.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </main>
  );
}
