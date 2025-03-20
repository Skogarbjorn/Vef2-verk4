"use client";

import { fetchCategories } from "../../lib/api.ts";
import { Layout, List } from "../page.tsx";
import { ReactNode, useEffect, useState } from "react";
import styles from "../page.module.css";
import Link from "next/link";
import InternalError from "../500.tsx";

export default function CategoriesPage() {
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

  async function handleDelete(slug: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/${slug}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to delete category`);
      }

      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.slug !== slug),
      );
    } catch (err) {
      setError((err as Error).message);
    }
  }
  function handleDeleteFactory(slug: string) {
    return () => handleDelete(slug);
  }

  if (error) {
    return <InternalError error={error} />;
  }

  return (
    <Layout>
      <h1>Edit Categories</h1>
      <List
        items={categories}
        renderItem={(category) => (
          <>
            <p className={styles.text}>{category.title}</p>
            <Link
              href={`/categories/edit/${category.slug}`}
              className={styles.link}
            >
              Edit
            </Link>
            <button name="delete" onClick={handleDeleteFactory(category.slug)}>
              Delete
            </button>
          </>
        )}
      />
      <Link href={`/categories/create`} className={styles.link}>
        Create new category
      </Link>
    </Layout>
  );
}
