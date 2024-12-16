export default async function AuthLayoutMain({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
      >
        <div
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", // Simplified clipPath
          }}
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>
      {children}
    </>
  );
}
