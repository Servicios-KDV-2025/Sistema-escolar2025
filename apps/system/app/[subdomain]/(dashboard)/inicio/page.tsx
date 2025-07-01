import { SignOutButton } from "@clerk/nextjs"

export default function inicioPage() {
  return (
    <div>
      <SignOutButton />
      <h1>Hello Page</h1>
    </div>
  );
}