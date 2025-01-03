import {
  GearIcon,
  Pencil2Icon,
  PlusCircledIcon,
  SymbolIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function DialogForm({
  children,
  openButton,
  openButtonIntent,
  openButtonSize,
  title,
  description,
  icon,
  buttonLabel,
  buttonLoading,
  buttonDisabled,
  handleSubmit,
  isOpen,
  setIsOpen,
}: {
  children: React.ReactNode;
  openButton: string;
  openButtonIntent: "default" | "dialog" | "delete";
  openButtonSize?: "sm" | "md" | "lg" | "xl";
  title: string;
  description?: string;
  icon?: string;
  buttonLabel: string;
  buttonLoading: boolean;
  buttonDisabled: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        {/* PICK UP HERE */}
        {icon ? (
          <>
            {icon === "settings" && (
              <Button
                intent="ghost"
                size="icon"
                onClick={() => setIsOpen(true)}
              >
                <GearIcon className="h-[14px] w-[14px] xl:h-[16px] xl:w-[16px]" />
                <p className="mx-1 text-xs">Settings</p>
              </Button>
            )}
            {icon === "delete" && (
              <Button
                intent="ghost"
                size="icon"
                onClick={() => setIsOpen(true)}
              >
                <TrashIcon className="h-[14px] w-[14px] xl:h-[16px] xl:w-[16px]" />
                <p className="mx-1 text-xs">Delete SLT</p>
              </Button>
            )}
            {icon === "bigPlus" && (
              <Button
                size="xl"
                className="w-[200px]"
                onClick={() => setIsOpen(true)}
              >
                <PlusCircledIcon className="h-[14px] w-[14px] xl:h-[25px] xl:w-[25px]" />
                <p className="mx-5 text-xs">{openButton}</p>
              </Button>
            )}
            {icon === "plus" && (
              <Button
                className=""
                onClick={() => setIsOpen(true)}
              >
                <PlusCircledIcon className="h-[14px] w-[14px] xl:h-[16px] xl:w-[16px]" />
                {openButtonSize != "sm" && (
                  <p className="mx-2 text-xs lg:text-sm">{openButton}</p>
                )}
              </Button>
            )}
            {icon === "pencil" && (
              <Button
                intent={openButtonIntent}
                size={"dialog"}
                className=""
                onClick={() => setIsOpen(true)}
              >
                <Pencil2Icon className="h-[14px] w-[14px] xl:h-[16px] xl:w-[16px]" />
                {openButtonSize != "sm" && (
                  <p className="mx-2 text-xs lg:text-sm">{openButton}</p>
                )}
              </Button>
            )}
          </>
        ) : (
          <Button
            size={openButtonSize ?? "default"}
            className="mx-auto"
          >
            {openButton}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-5xl border-l-4 border-secondary shadow-primary">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {children}
          <div className="mt-5 gap-2 sm:mt-12 sm:flex">
            <Button type="submit" disabled={buttonDisabled} intent="default">
              {buttonLoading ? (
                <SymbolIcon className="h-5 w-5 animate-spin" />
              ) : (
                buttonLabel
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
