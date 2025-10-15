"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [client] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      </body>
    </html>
  );
}
