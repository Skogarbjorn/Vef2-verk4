"use client";

import { fetchCategories } from "../../../lib/api.ts";
import Form, { FormField } from "../../form.tsx";
import { useEffect, useState } from "react";
import { Layout } from "../../layoutProp.tsx";
import styles from "../../page.module.css";
import UserError from "../../400.tsx";

export default function CreateQuestionPage() {
  const [categories, setCategories] = useState<
    { id: number; title: string; slug: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

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

  const fields: FormField[] = [
    { name: "question", label: "Question: ", type: "text" },
    {
      name: "categoryId",
      label: "Which Category? ",
      type: "select",
      options: categories.map((item) => ({
        key: String(item.id),
        value: item.title,
      })),
    },
    {
      name: "answerCount",
      label: "How many answers? ",
      type: "number",
      min: 2,
      max: 4,
    },
  ];

  async function handleFormSubmit(values: Record<string, string>) {
    console.log(values);
    const answerCount = Number(values.answerCount);

    const answers = Array.from({ length: answerCount }, (_, index) => ({
      answer: values[`answer${index}`],
      isCorrect: values[`isCorrect${index}`] === "true",
    }));

    const payload = {
      question: values.question,
      categoryId: Number(values.categoryId),
      answers,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: payload.question,
            categoryId: payload.categoryId,
            answers: payload.answers,
          }),
        },
      );
      if (!response.ok) {
        throw new Error(`${response.status}: Failed to add new question`);
      }
      setMessage("Question created successfully");
      setSubmitted(true);
    } catch (err) {
      setError(`Error ` + (err as Error).message);
    }
  }

  if (error) {
    return <UserError error={error} />;
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold">Create a Question</h1>
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
