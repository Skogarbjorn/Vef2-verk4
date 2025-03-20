"use client";

import { useEffect, useState } from "react";
import { Layout } from "../../../layoutProp.tsx";
import { fetchCategory } from "../../../../lib/api.ts";
import Form, { FormField } from "../../../form.tsx";
import styles from "../../../page.module.css";
import { useParams } from "next/navigation";

export default function EditPage() {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [category, setCategory] = useState<{
    slug: string;
    title: string;
    id: number;
  } | null>(null);
  const [error, setError] = useState<string>("");
  const params = useParams<{ slug: string }>;
  const { slug } = params();

  useEffect(() => {
    async function loadCategory() {
      const result = await fetchCategory(slug);
      if (typeof result === typeof Error) {
        setError(result.message);
      } else {
        setCategory(result);
      }
    }
    loadCategory();
  }, []);

  const fields: FormField[] = [
    {
      name: "title",
      label: "Category title: ",
      type: "text",
      value: category ? category.title : undefined,
    },
  ];

  async function handleFormSubmit(values: Record<string, string>) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/${category?.slug}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: values.title,
          }),
        },
      );
      if (!response.ok) {
        throw new Error(`${response.status}: Failed to edit category`);
      }
      setMessage("Category updated successfully");
      setSubmitted(true);
    } catch (err) {
      setError(`Error: ` + (err as Error).message);
    }
  }

  return (
    <Layout>
      <h1>Edit Category</h1>
      {submitted ? (
        <p className={styles.submit_message}>{message}</p>
      ) : (
        <>
          {error && <p>{error}</p>}
          <Form fields={fields} onSubmit={handleFormSubmit} />
        </>
      )}
    </Layout>
  );
}
