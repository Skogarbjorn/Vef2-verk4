import { Layout } from "./page.tsx";
import Link from "next/link";

export default function InternalError({ error }: { error: string }) {
  return (
    <Layout>
      <h1>500: Internal Error</h1>
      <p>{error}</p>
      <Link href={`/`}>Go back to select a category</Link>
    </Layout>
  );
}
