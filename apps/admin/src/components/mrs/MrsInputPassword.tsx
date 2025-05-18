import { Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface InputPasswordProps extends React.ComponentProps<"input"> {
  className?: string;
  inputClassName?: string;
}
export default function InputPassword({
  inputClassName,
  className,
  ...props
}: InputPasswordProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div className={cn("relative", className)}>
      <Input
        type={visible ? "text" : "password"}
        {...props}
        className={cn("pr-12", inputClassName)}
      />
      <div className="absolute right-0 bottom-0 top-0 flex justify-center items-center aspect-square">
        <Button
          size="icon"
          type="button"
          className="bg-muted hover:bg-foreground/10 active:bg-muted text-muted-foreground h-9 w-9"
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? <Eye /> : <EyeOff />}
        </Button>
      </div>
    </div>
  );
}
