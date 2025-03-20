import styles from "./page.module.css";
import { ReactNode } from "react";

type ListProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
};

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
