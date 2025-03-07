export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="flex justify-end items-center p-4 gap-4 h-16"></header>
        {children}
      </body>
    </html>
  );
}
