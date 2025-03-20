import { useState } from "react";
import styles from "./page.module.css";
import { List } from "./list.tsx";

type QuizProps = {
  questions: {
    id: number;
    question: string;
    answers: {
      answer: string;
      isCorrect: boolean;
    }[];
  }[];
  handleSubmit: (selectedAnswers: Record<string, boolean>) => void;
};

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
