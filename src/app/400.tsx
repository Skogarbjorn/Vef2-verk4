import { Layout } from "./page.tsx";
import Link from "next/link";

export default function UserError({ error }: { error: string }) {
  return (
    <Layout>
      <h1>400: Bad Request</h1>
      <p>{error}</p>
      <Link href={`/`}>Go back to select a category</Link>
    </Layout>
  );
}
