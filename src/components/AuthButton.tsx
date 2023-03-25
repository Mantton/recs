import { SignedIn, UserButton, SignedOut, SignInButton } from "@clerk/nextjs";

export default function AuthButton() {
  return (
    <>
      <SignedIn>
        {/* Mount the UserButton component */}
        <UserButton />
      </SignedIn>
      <SignedOut>
        {/* Signed out users get sign in button */}
        <SignInButton />
      </SignedOut>
    </>
  );
}
