import ClientLayout from "./clientLayout";

export const metadata = {
  title: "Token-Gated Dashboard",
  description: "A secure, responsive Web3 dashboard for token positions.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
