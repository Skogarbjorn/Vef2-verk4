"use client";

import { useEffect, useState } from "react";
import {
  fetchCategories,
  fetchQuestions,
  fetchQuestionsByCategory,
} from "../../lib/api.ts";
import { Layout } from "../layoutProp.tsx";
import { List } from "../list.tsx";
import styles from "../page.module.css";
import Link from "next/link";
import InternalError from "../500.tsx";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<
    { id: number; question: string; categoryId: number }[]
  >([]);
  const [categories, setCategories] = useState<
    { id: number; title: string; slug: string }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
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
    async function loadQuestions() {
      try {
        const result = await fetchQuestions();
        if (result instanceof Error) {
          setError(result.message);
        } else {
          setQuestions(result.questions);
        }
      } catch (err) {
        setError((err as Error).message);
      }
    }
    loadCategories();
    loadQuestions();
  }, []);

  async function loadQuestions(categorySlug: string = "all") {
    const result =
      categorySlug === "all"
        ? await fetchQuestions()
        : await fetchQuestionsByCategory(categorySlug);
    if (typeof result === typeof Error) {
      setError(result.message);
    } else {
      setQuestions(questions);
    }
  }

  function handleCategoryChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const categorySlug =
      event.target.value === "all" ? "all" : event.target.value;
    setSelectedCategory(categorySlug);
    loadQuestions(categorySlug);
  }

  if (error) {
    return <InternalError error={error} />;
  }

  return (
    <Layout>
      <h1>Edit questions</h1>
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className={styles.select}
      >
        <option value="all">All categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.slug}>
            {category.title}
          </option>
        ))}
      </select>
      <List
        items={questions}
        renderItem={(question: {
          id: number;
          question: string;
          categoryId: number;
        }) => (
          <>
            <p className={styles.text}>{question.question}</p>
            <Link
              href={`/questions/edit/${question.id}`}
              className={styles.link}
            >
              Edit
            </Link>
          </>
        )}
      />
      <Link href={`/questions/create`} className={styles.link}>
        Create new question
      </Link>
    </Layout>
  );
}
