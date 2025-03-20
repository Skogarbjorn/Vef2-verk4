"use client";

import { Usable, use, useEffect, useState } from "react";
import { Layout, List } from "../../page.tsx";
import styles from "../../page.module.css";
import NotFound from "../../not-found.tsx";

type QuizProps = {
  questions: T[];
  handleSubmit: (selectedAnswers: Record<string, boolean>) => void;
};

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

export function Quiz({
  questions,
  handleSubmit,
  checkedAnswers,
}: QuizProps & {
  checkedAnswers: Record<string, "correct" | "incorrect" | "default">;
}) {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, boolean>
  >({});

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = event.target;
    setSelectedAnswers((prev) => ({ ...prev, [name]: checked }));
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    handleSubmit(selectedAnswers);
  }

  console.log(checkedAnswers);

  return (
    <form onSubmit={onSubmit} id="quiz-form">
      {questions.length > 0 ? (
        <>
          {questions.map((question, index: number) => (
            <div className={styles.question} key={index}>
              <pre>{question.question}</pre>
              <List
                items={question.answers}
                renderItem={(answer, aIndex) => {
                  const name = `${index}-${aIndex}`;
                  const answerClass =
                    checkedAnswers[name] === "correct"
                      ? styles.correct
                      : checkedAnswers[name] === "incorrect"
                        ? styles.incorrect
                        : "";

                  return (
                    <div key={aIndex} className={answerClass}>
                      <label>
                        <input
                          type="checkbox"
                          name={name}
                          checked={selectedAnswers[name] || false}
                          onChange={handleChange}
                        ></input>
                        {answer.answer}
                      </label>
                    </div>
                  );
                }}
              />
            </div>
          ))}
          <button type="submit" className={styles.submit_button}>
            Submit
          </button>
        </>
      ) : (
        <p className={styles.no_entries}>No questions for this category</p>
      )}
    </form>
  );
}
