import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type PropsType = {
  Trigger: React.ReactNode;
  Content: React.ReactNode;
  Header?: React.ReactNode;
  Footer?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function DialogCustom({
  Trigger,
  Content,
  Header,
  Footer,
  open = false,
  onOpenChange = () => {},
}: PropsType) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="mb-2">
          <DialogTitle>{Header}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {Content}
        <DialogFooter className="mt-2 sm:justify-start">{Footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
