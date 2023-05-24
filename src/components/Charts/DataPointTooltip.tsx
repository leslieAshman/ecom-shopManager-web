export interface DataPointTooltipProps {
  x: string;
  y: string;
  className?: string;
  contentTemplate?: (x: string, y: string) => JSX.Element;
}

export default function DataPointTooltip({ x, y, className, contentTemplate }: DataPointTooltipProps) {
  return (
    <div className={`flex flex-col items-center p-1 ${className || ''}`.trim()}>
      {contentTemplate ? (
        contentTemplate(x, y)
      ) : (
        <>
          <div className="font-sans text-sm">{y}</div>
          <div className="font-sans text-xs text-lightPurple">{x}</div>
        </>
      )}
    </div>
  );
}
