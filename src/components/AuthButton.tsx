import { SignedIn, UserButton, SignedOut, SignInButton } from "@clerk/nextjs";

export default function AuthButton() {
  return (
    <>
      <SignedIn>
        {/* Mount the UserButton component */}
        <UserButton
          userProfileMode="navigation"
          userProfileUrl="/profile"
          appearance={{
            variables: {
              colorPrimary: "#64748b",
            },
          }}
        />
      </SignedIn>
      <SignedOut>
        {/* Signed out users get sign in button */}
        <div className="rounded-md bg-slate-300 px-2 py-1 text-slate-700 transition-colors duration-300 hover:bg-slate-400">
          <SignInButton />
        </div>
      </SignedOut>
    </>
  );
}
