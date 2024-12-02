import useUnconfirmedTx from "./useUnconfirmedTx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Loader } from "lucide-react";

// TODO: How often does this retrigger?

export default function UnconfirmedTx({
  unconfirmedTxHash,
}: {
  unconfirmedTxHash: string | undefined;
}) {
  const { data, isError, isLoading } = useUnconfirmedTx(
    unconfirmedTxHash ?? "",
  );

  if (!unconfirmedTxHash) return null;
  return (
    <Popover>
      <PopoverTrigger>
        <Loader />
      </PopoverTrigger>
      <PopoverContent className="max-w-fit bg-white">
        {isLoading && <div>Loading...</div>}
        {isError && <div>Error</div>}
        {data && (
          <>
            {unconfirmedTxHash.substring(0, 3)}...
            {unconfirmedTxHash.substring(61)} : {data.state}
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
