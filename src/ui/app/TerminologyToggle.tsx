import { BookIcon } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { terminologySkins } from "~/config/terminology/terminologySkins"
import { useTerminology } from "~/contexts/terminology-context"

export function TerminologyToggle() {
  const { skinName, changeSkin } = useTerminology()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button intent="outline" className="z-50 rounded-full p-3">
          <BookIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.keys(terminologySkins).map((skin) => (
          <DropdownMenuItem
            key={skin}
            onClick={() => changeSkin(skin)}
            className={skinName === skin ? "bg-accent" : ""}
          >
            {skin.charAt(0).toUpperCase() + skin.slice(1)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
