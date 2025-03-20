"use client";

import styles from "./page.module.css";
import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import { fetchCategories } from "../lib/api.ts";
import InternalError from "./500.tsx";

type LayoutProps = {
  children: ReactNode;
};

type ListProps = {
  items: T[];
  renderItem: (item: T, index: number) => JSX.Element;
};

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

export function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.nav_entry}>
            Select Categories
          </Link>
          <Link href="/categories" className={styles.nav_entry}>
            Edit categories
          </Link>
          <Link href="/questions" className={styles.nav_entry}>
            Edit questions
          </Link>
        </nav>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} gamer quiz
      </footer>
    </div>
  );
}

export function List<T>({ items = [], renderItem }: ListProps<T>) {
  return (
    <ul className={styles.list}>
      {Array.isArray(items)
        ? items.map((item, index: number) => (
            <li key={index} className={styles.item}>
              {renderItem(item, index)}
            </li>
          ))
        : null}
    </ul>
  );
}
