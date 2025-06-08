import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PropsType = React.ComponentProps<"button"> & {
  tooltip?: string;
};

export default function ButtonIcon({
  children,
  tooltip = "",
  ...rest
}: PropsType) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger {...rest} className="cursor-pointer absolute top-[20%] right-[3%] hover:bg-neutral-800 ease-in-out duration-300 rounded-full p-2">{children}</TooltipTrigger>
        <TooltipContent className="bg-neutral-950">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
