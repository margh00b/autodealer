import { SignIn } from "@clerk/nextjs";

export default function Signin() {
  return (
    <div className="flex justify-center mt-10">
      <SignIn />
    </div>
  );
}
