export function Loader() {
  return (
    <div aria-label="Loading" className="flex justify-center gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-primary animate-wave h-5 w-1 rounded-full"
          style={{ animationDelay: `${i * 200}ms` }}
        />
      ))}
    </div>
  );
}
