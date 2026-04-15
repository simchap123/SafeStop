export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>SafeStop</h1>
      <p>Child vehicle safety system &mdash; API server running.</p>
      <p>
        <a href="/api/health">Health Check</a>
      </p>
    </main>
  );
}
