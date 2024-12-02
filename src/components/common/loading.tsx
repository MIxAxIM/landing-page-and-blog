import { UpdateIcon } from "@radix-ui/react-icons";

export default function Loading({ size = 25 }: { size?: number }) {
  return (
    <div className="flex w-full justify-center items-center py-5">
      <UpdateIcon width={size} height={size} className="animate-spin" />
    </div>
  );
}
