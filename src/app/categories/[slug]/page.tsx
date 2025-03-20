"use client";

import { Usable, use, useEffect, useState } from "react";
import { Layout } from "../../page.tsx";
import NotFound from "../../not-found.tsx";
import { Quiz } from "../../quiz.tsx";

export default function CategoryPage({
  params,
}: {
  params: Usable<{ slug: string }>;
}) {
  const [questions, setQuestions] = useState<
    {
      id: number;
      question: string;
      answers: { answer: string; isCorrect: boolean }[];
    }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [checkedAnswers, setCheckedAnswers] = useState<
    Record<string, "correct" | "incorrect" | "default">
  >({});
  const { slug } = use(params);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/${slug}/questions`,
        );
        if (!response.ok) {
          throw new Error(
            `Error ${response.status}: Failed to fetch questions`,
          );
        }
        const data = await response.json();
        setQuestions(data.questions);
      } catch (err) {
        setError((err as Error).message);
      }
    }

    fetchCategory();
  }, [slug]);

  function handleQuizSubmit(selectedAnswers: Record<string, boolean>) {
    const newCheckedAnswers: Record<
      string,
      "correct" | "incorrect" | "default"
    > = {};

    questions.forEach((question, qIndex) => {
      question.answers.forEach((answer, aIndex) => {
        const key = `${qIndex}-${aIndex}`;
        if (selectedAnswers[key]) {
          newCheckedAnswers[key] = answer.isCorrect ? "correct" : "incorrect";
        } else {
          newCheckedAnswers[key] = "default";
        }
      });
    });

    setCheckedAnswers(newCheckedAnswers);
  }

  if (error) {
    return <NotFound />;
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold">Welcome to quiz</h1>
      <p>Questions</p>
      <Quiz
        questions={questions}
        handleSubmit={handleQuizSubmit}
        checkedAnswers={checkedAnswers}
      />
    </Layout>
  );
}
