// // components/ReactQueryProvider.tsx
// "use client";

// import React from "react";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 5 * 60 * 1000, // 5 minutes
//       retry: 2,
//       refetchOnWindowFocus: false,
//     },
//   },
// });

// const ReactQueryProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   return (
//     <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//   );
// };

// export default ReactQueryProvider;
