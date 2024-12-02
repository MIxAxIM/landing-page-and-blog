import { LightDarkToggle } from "~/components/common/LightDarkToggle";

export default function ColorsPage() {
  return (
    <div className="mx-auto my-10 grid w-11/12 grid-cols-6 gap-10">
      <div>
        <div className="flex h-[100px] w-full bg-background" />
        <div>background</div>
      </div>
      <div>
        <div className="flex h-[100px] w-full bg-foreground" />
        <div>foreground</div>
      </div>
      <div>
        <div className="flex h-[100px] w-full bg-card" />
        <div>card</div>
      </div>
      <div>
        <div className="flex h-[100px] w-full bg-card-foreground" />
        <div>card-foreground</div>
      </div>
      <div>
        <div className="flex h-[100px] w-full bg-popover" />
        <div>popover</div>
      </div>
      <div>
        <div className="flex h-[100px] w-full bg-popover-foreground" />
        <div>popover-foreground</div>
      </div>
      <div>
        <div className="flex h-[100px] w-full bg-primary" />
        <div>primary</div>
      </div>
      <div>
        <div className="flex h-[100px] w-full bg-primary-foreground" />
        <div>primary-foreground</div>
      </div>
      <div>
        <div className="flex h-[100px] w-full bg-secondary" />
        <div>secondary</div>
      </div>
      <div>
        <div className="flex h-[100px] w-full bg-secondary-foreground" />
        <div>secondary-foreground</div>
      </div>
      <div>
        <div className="flex h-[100px] w-full bg-muted" />
        <div>muted</div>
      </div>
      <div>
        <div className="flex h-[100px] w-full bg-muted-foreground" />
        <div>muted-foreground</div>
      </div>
      <div>
        <div className="flex h-[100px] w-full bg-accent" />
        <div>accent</div>
      </div>
      <div>
        <div className="flex h-[100px] w-full bg-accent-foreground" />
        <div>accent-foreground</div>
      </div>
      <div>
        <div className="flex h-[100px] w-full bg-destructive" />
        <div>destructive</div>
      </div>
      <div>
        <div className="flex h-[100px] w-full bg-destructive-foreground" />
        <div>destructive-foreground</div>
      </div>
      <div>
        <div className="flex h-[100px] w-full bg-border" />
        <div>border</div>
      </div>
      <div>
        <div className="flex h-[100px] w-full bg-input" />
        <div>input</div>
      </div>
      <div>
        <div className="flex h-[100px] w-full bg-ring" />
        <div>ring</div>
      </div>
      <div>
        <div className="bg-radius flex h-[100px] w-full" />
        <div>radius</div>
      </div>
      <div>
        <div className="flex h-[100px] w-full bg-warning" />
        <div>warning</div>
      </div>
      <div>
        <div className="flex h-[100px] w-full bg-warning-foreground" />
        <div>warning-foreground</div>
      </div>
      <div>
        <div className="flex h-[100px] w-full bg-success" />
        <div>success</div>
      </div>
      <div>
        <div className="flex h-[100px] w-full bg-success-foreground" />
        <div>success-foreground</div>
      </div>
      <LightDarkToggle />
    </div>
  );
}
