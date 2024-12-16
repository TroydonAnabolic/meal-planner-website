import Link from "next/link";
import { useSession } from "next-auth/react";

type Props = {};

const LoginLink = (props: Props) => {
  const { data: session, status } = useSession();

  if (status === "authenticated" && session.user) {
    return (
      <Link
        href="/meal-planner/dashboard"
        className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-500"
      >
        {session.user.givenName} <span aria-hidden="true">&rarr;</span>
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-500"
    >
      Log in <span aria-hidden="true">&rarr;</span>
    </Link>
  );
};

export default LoginLink;
