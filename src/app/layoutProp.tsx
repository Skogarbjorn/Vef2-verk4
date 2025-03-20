import { ReactNode } from "react";
import styles from "./page.module.css";
import Link from "next/link";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.nav_entry}>
            Select Categories
          </Link>
          <Link href="/categories" className={styles.nav_entry}>
            Edit categories
          </Link>
          <Link href="/questions" className={styles.nav_entry}>
            Edit questions
          </Link>
        </nav>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} gamer quiz
      </footer>
    </div>
  );
}
