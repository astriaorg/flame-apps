import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../shadcn-primitives";
import { InfoIcon } from "../../icons";

interface InfoTooltipProps {
  content: string;
  side?: "left" | "right" | "top" | "bottom" | undefined;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  side,
}: InfoTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip defaultOpen={false}>
        <TooltipTrigger asChild>
          <span onMouseDown={(e) => e.stopPropagation()}>
            <InfoIcon
              size={16}
              className="text-grey-light hover:text-white cursor-pointer"
            />
          </span>
        </TooltipTrigger>
        <TooltipContent
          className="bg-black text-white border border-border rounded-md px-3 py-2 max-w-[200px] text-[14px]"
          sideOffset={5}
          side={side || "left"}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
