export default function LoadingContentEditor({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[50vh] items-center justify-center">
      <div className="flex w-full max-w-2xl animate-pulse items-center justify-center">
        {children}
      </div>
    </div>
  );
}
