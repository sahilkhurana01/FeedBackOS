export function WorkspacePlaceholder({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="flex min-h-[58vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-[15px] font-semibold text-muted-foreground">Coming next</p>
      <h1 className="mt-2 max-w-lg text-4xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-4 max-w-md text-[17px] leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  );
}
