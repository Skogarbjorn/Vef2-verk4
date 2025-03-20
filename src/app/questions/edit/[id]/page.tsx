"use client";

import { ReactNode, Usable, use, useEffect, useState } from "react";
import { fetchCategories, fetchQuestion } from "../../../../lib/api.ts";
import { Layout } from "../../../page.tsx";
import Form from "../../../form.tsx";
import styles from "../../../page.module.css";

export default function EditQuestionPage({
  params,
}: {
  params: Usable<{ id: number }>;
}) {
  const [question, setQuestion] = useState<{
    id: number;
    question: string;
    categoryId: number;
    answers: { answer: string; isCorrect: boolean }[];
  } | null>(null);
  const [categories, setCategories] = useState<
    { id: number; title: string; slug: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const id = use(params).id;

  useEffect(() => {
    async function fetchData() {
      try {
        const [questionResult, categoriesResult] = await Promise.all([
          fetchQuestion(id),
          fetchCategories(),
        ]);
        setQuestion(questionResult);
        setCategories(categoriesResult);
      } catch (err) {
        setError((err as Error).message);
      }
    }

    fetchData();
  }, [id]);

  const fields = question
    ? [
        {
          name: "question",
          label: "Question: ",
          type: "text",
          value: question?.question,
        },
        {
          name: "categoryId",
          label: "Which Category? ",
          type: "select",
          options: categories.map((item) => ({
            value: item.title,
            key: item.id,
          })),
          value: question?.categoryId,
        },
        {
          name: "answerCount",
          label: "How many answers? ",
          type: "number",
          min: 2,
          max: 4,
          value: question?.answers.length,
        },
        {
          name: "answers",
          label: "answers",
          type: "answers",
          answers: question?.answers,
        },
      ]
    : [];

  async function handleFormSubmit(values: Record<string, string>) {
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/questions/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );
      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to edit question`);
      }
      setMessage("Question updated successfully");
      setSubmitted(true);
    } catch (err) {
      setMessage(`Error: ` + (err as Error).message);
    }
  }

  return (
    <Layout>
      <h1>Edit Question</h1>
      {submitted ? (
        <p className={styles.submit_message}>{message}</p>
      ) : (
        <Form fields={fields} onSubmit={handleFormSubmit} />
      )}
    </Layout>
  );
}
