"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Layout } from "./layoutProp.tsx";
import { fetchCategories } from "../lib/api.ts";
import InternalError from "./500.tsx";
import { List } from "./list.tsx";

export default function Home() {
  const [categories, setCategories] = useState<
    { id: number; title: string; slug: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const result = await fetchCategories();
        if (result instanceof Error) {
          setError(result.message);
        } else {
          setCategories(result);
        }
      } catch (err) {
        setError((err as Error).message);
      }
    }
    loadCategories();
  }, []);

  if (error) {
    return <InternalError error={error} />;
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold">Select a Category</h1>
      <p>Select category</p>
      <List
        items={categories}
        renderItem={(category) => (
          <Link href={`/categories/${category.slug}`} className={styles.link}>
            {category.title}
          </Link>
        )}
      />
    </Layout>
  );
}
