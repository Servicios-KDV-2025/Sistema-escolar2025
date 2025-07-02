import { SignOutButton } from "@clerk/nextjs"
import Link from 'next/link';

export default function inicioPage() {
  return (
    <div>
      <SignOutButton />
      <h1>Hello Page</h1>
      <Link href={'/escuela'}>Ir a la escuela</Link>
    </div>
  );
}