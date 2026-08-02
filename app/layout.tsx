export const metadata = {
  title: "Cartoon Video Generator",
  description: "Turn a line of text into a short animated cartoon video.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
          color: "#111827",
          background: "#F5F7FB",
        }}
      >
        {children}
      </body>
    </html>
  );
}
