export default function CardSLT({
  moduleCode,
  moduleIndex,
  sltText,
}: {
  moduleCode: string;
  moduleIndex: number;
  sltText: string;
}) {
  return (
    <div className="gap-1 px-5 py-3">
      <p className="text-right text-2xl font-bold leading-7 text-muted-foreground">
        SLT {moduleCode}.{moduleIndex}:
      </p>
      <p className="text-right text-xl font-semibold leading-7">{sltText}</p>
    </div>
  );
}
