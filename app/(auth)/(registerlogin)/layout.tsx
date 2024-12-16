import Image from "next/image";
import { auth } from "@/auth";
import UserAuthenticated from "@/app/components/auth/user-authenticated";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <main className="flex min-h-screen w-full">
      {/* Left Section: Form Content */}
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2">
        {session ? <UserAuthenticated /> : children}
      </div>

      {/* Right Section: Image */}
      <div className="relative hidden lg:block lg:w-1/2">
        <Image
          alt="Login"
          src="/aiimages/food/login-img.jpg"
          className="absolute inset-0 h-full w-full object-cover"
          fill
        />
      </div>
    </main>
  );
}
