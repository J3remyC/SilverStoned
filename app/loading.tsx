export default function Loading() {
  return (
    <main id="main" tabIndex={-1} className="page-frame route-page" aria-busy="true">
      <p role="status">Loading page…</p>
    </main>
  );
}
