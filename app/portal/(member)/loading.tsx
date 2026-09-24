export default function Loading() {
  return (
    <div className="space-y-6" aria-busy="true">
      <span className="sr-only" role="status">
        Ачаалж байна…
      </span>
      <div className="h-9 w-48 animate-pulse rounded-xl bg-white/10" />
      <div className="glass h-40 animate-pulse rounded-3xl" />
      <div className="glass h-28 animate-pulse rounded-3xl" />
    </div>
  );
}
