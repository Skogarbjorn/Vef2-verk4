"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type FieldType = "text" | "select" | "radio" | "number" | "answers";

type Answer = {
  answer: string;
  isCorrect: boolean;
};

export type FormField = {
  name: string;
  label: string;
  type: FieldType;
  options?: { key: string; value: string }[];
  min?: number;
  max?: number;
  value?: string | number;
  answers?: Answer[];
};

type FormProps = {
  fields: FormField[];
  onSubmit: (values: Record<string, string>) => void;
  answers?:
    | {
        answer: string;
        isCorrect: boolean;
      }[]
    | undefined;
};

export default function Form({ fields, onSubmit }: FormProps) {
  const answerField = fields.find((field) => field.type === "answers");
  const answerLength = answerField ? (answerField.answers?.length ?? 2) : 2;

  const initialFormData: Record<string, string> = {};

  fields.forEach((field) => {
    if (field.value) {
      initialFormData[field.name] = field.value.toString();
    }
  });

  if (answerField) {
    answerField.answers?.forEach((answer, index) => {
      initialFormData[`answer${index}`] = answer.answer;
      initialFormData[`isCorrect${index}`] = answer.isCorrect
        ? "true"
        : "false";
    });
  }

  const [formData, setFormData] =
    useState<Record<string, string>>(initialFormData);

  const memoizedInitialFormData = useMemo(
    () => initialFormData,
    [answerField, fields],
  );

  useEffect(() => {
    setFormData(memoizedInitialFormData);
  }, [memoizedInitialFormData]);

  const [answerCount, setAnswerCount] = useState<number>(answerLength);

  useEffect(() => {
    setAnswerCount(answerLength);
  }, [answerLength]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value, type } = event.target;
    if (type === "checkbox" && event.target instanceof HTMLInputElement) {
      const checked = event.target.checked;
      setFormData((prev) => ({ ...prev, [name]: checked ? "true" : "false" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "answerCount") {
      const clampedValue =
        Number(value) > 4 ? 4 : Number(value) < 2 ? 2 : Number(value);
      setAnswerCount(clampedValue);
      formData[name] = "4";
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {fields.map((field) => (
        <div key={field.name} className={styles.form_div}>
          <label className={styles.form_label}>{field.label}</label>
          {field.type === "text" && (
            <input
              type="text"
              name={field.name}
              value={formData[field.name] ?? field.value ?? ""}
              onChange={handleChange}
              className={styles.form_text}
              required
            />
          )}
          {field.type === "number" && field.min && field.max && (
            <input
              type="number"
              name={field.name}
              value={formData[field.name] ?? field.value ?? ""}
              onChange={handleChange}
              className={styles.form_number}
              min={field.min}
              max={field.max}
              required
            />
          )}
          {field.type === "select" && field.options && (
            <select
              name={field.name}
              value={formData[field.name] ?? field.value ?? ""}
              onChange={handleChange}
              className={styles.form_select}
              required
            >
              <option value="" disabled>
                Select an option
              </option>
              {field.options.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.value}
                </option>
              ))}
            </select>
          )}
          {field.type === "radio" && field.options && (
            <div className={styles.form_radio}>
              {field.options.map((option) => (
                <label key={option.key} className={styles.form_label}>
                  <input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    onChange={handleChange}
                    checked={formData[field.name] === option.key}
                    className={styles.form_input}
                  />
                  {option.value}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      {fields.find((field) => field.name === "answerCount")
        ? Array.from({ length: answerCount }).map((_, index) => {
            const answer = answerField?.answers?.[index] ?? {
              answer: "",
              isCorrect: false,
            };

            return (
              <div key={index} className={styles.form_div}>
                <label className={styles.form_label}>Answer {index + 1}:</label>
                <input
                  type="text"
                  name={`answer${index}`}
                  value={formData[`answer${index}`] ?? answer.answer}
                  onChange={handleChange}
                  className={styles.form_text}
                  required
                />
                <input
                  type="checkbox"
                  name={`isCorrect${index}`}
                  checked={
                    formData[`isCorrect${index}`]
                      ? formData[`isCorrect${index}`] === "true"
                      : answer.isCorrect
                  }
                  onChange={handleChange}
                  className={styles.form_checkbox}
                />
                Correct?
              </div>
            );
          })
        : null}

      <button type="submit" className={styles.submit_button}>
        Submit
      </button>
    </form>
  );
}
