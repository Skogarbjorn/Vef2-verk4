"use client";

import Form, { FormField } from "../../form.tsx";
import { useState } from "react";
import { Layout } from "../../layoutProp.tsx";
import styles from "../../page.module.css";

export default function CreateCategoryPage() {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fields: FormField[] = [
    {
      name: "name",
      label: "Category Name: ",
      type: "text",
    },
  ];

  async function handleFormSubmit(values: Record<string, string>) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/category`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: values.name,
          }),
        },
      );
      if (!response.ok) {
        throw new Error(`${response.status}: Category probably already exists`);
      }
      setMessage("Category created successfully");
      setSubmitted(true);
    } catch (err) {
      setError(`Error: ` + (err as Error).message);
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold">Create a new category</h1>
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
