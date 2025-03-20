import { Layout } from "./page.tsx";
import Link from "next/link";

export default function NotFound() {
  return (
    <Layout>
      <h1>404: Not found</h1>
      <p>The page you were looking for does not exist</p>
      <Link href={`/`}>Go back to select a category</Link>
    </Layout>
  );
}
