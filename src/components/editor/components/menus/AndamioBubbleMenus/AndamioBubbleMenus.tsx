import { BubbleMenu, type Editor } from "@tiptap/react";
import {
  FontBoldIcon,
  FontItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  DividerVerticalIcon,
  Link1Icon,
  LinkBreak1Icon,
  CodeIcon,
  ListBulletIcon,
  QuoteIcon,
} from "@radix-ui/react-icons";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { useCallback } from "react";
import { ListOrderedIcon } from "lucide-react";

const editorColors = [
  { name: "blue", colorVar: "hsl(var(--editor-blue))" },
  { name: "green", colorVar: "hsl(var(--editor-green))" },
  { name: "orange", colorVar: "hsl(var(--editor-orange))" },
  { name: "yellow", colorVar: "hsl(var(--editor-yellow))" },
];

export function AndamioBubbleMenu({ editor }: { editor: Editor }) {
  const setLink = useCallback(() => {
    const previousUrl: string = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) {
      return;
    }
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!!editor) {
    return (
      <div>
        <BubbleMenu
          editor={editor}
          className="edit-menu flex flex-row gap-1 rounded-md border border-gray-600 bg-background p-1"
          tippyOptions={{
            placement: "top-end",
          }}
        >
          <ToggleGroup type="multiple">
            {editor.isActive("imageBlock") && (
              <>
                <ToggleGroupItem
                  value="imageSmall"
                  aria-label="imageSmall"
                  onClick={() =>
                    editor.chain().focus().setImageBlockWidth(300).run()
                  }
                >
                  Small
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="imageSmall"
                  aria-label="imageSmall"
                  onClick={() =>
                    editor.chain().focus().setImageBlockWidth(600).run()
                  }
                >
                  Medium
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="imageSmall"
                  aria-label="imageSmall"
                  onClick={() =>
                    editor.chain().focus().setImageBlockWidth(900).run()
                  }
                >
                  Large
                </ToggleGroupItem>
              </>
            )}
            {!editor.isActive("imageBlock") && (
              <>
                <ToggleGroupItem
                  value="bold"
                  aria-label="Toggle bold"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  data-state={editor.isActive("bold") ? "on" : "off"}
                >
                  <FontBoldIcon className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="italic"
                  aria-label="Toggle italic"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  data-state={editor.isActive("italic") ? "on" : "off"}
                >
                  <FontItalicIcon className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="underline"
                  aria-label="Toggle underline"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  data-state={editor.isActive("underline") ? "on" : "off"}
                >
                  <UnderlineIcon className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="strikethrough"
                  aria-label="Toggle strikethrough"
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  data-state={editor.isActive("strike") ? "on" : "off"}
                >
                  <div>
                    <StrikethroughIcon className="h-4 w-4" />
                  </div>
                </ToggleGroupItem>

                <DividerVerticalIcon className="h-8 text-gray-600" />

                <ToggleGroupItem
                  value="paragraph"
                  aria-label="paragraph"
                  onClick={() => editor.chain().focus().setParagraph().run()}
                  data-state={editor.isActive("paragraph") ? "on" : "off"}
                >
                  p
                </ToggleGroupItem>

                <ToggleGroupItem
                  value="heading1"
                  aria-label="header 1"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                  data-state={
                    editor.isActive("heading", { level: 1 }) ? "on" : "off"
                  }
                >
                  H1
                </ToggleGroupItem>

                <ToggleGroupItem
                  value="heading2"
                  aria-label="header 2"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  data-state={
                    editor.isActive("heading", { level: 2 }) ? "on" : "off"
                  }
                >
                  H2
                </ToggleGroupItem>

                <ToggleGroupItem
                  value="heading3"
                  aria-label="header 3"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  data-state={
                    editor.isActive("heading", { level: 3 }) ? "on" : "off"
                  }
                >
                  H3
                </ToggleGroupItem>

                <DividerVerticalIcon className="h-8 text-gray-300" />
                <ToggleGroupItem
                  value="linkset"
                  aria-label="linkset"
                  onClick={setLink}
                >
                  <Link1Icon className="h-4 w-4" />
                </ToggleGroupItem>

                <ToggleGroupItem
                  value="linkset"
                  aria-label="linkset"
                  onClick={() => editor.chain().focus().unsetLink().run()}
                  disabled={!editor.isActive("link")}
                >
                  <LinkBreak1Icon className="h-4 w-4" />
                </ToggleGroupItem>

                <DividerVerticalIcon className="h-8 text-gray-600" />

                <ToggleGroupItem
                  value="codeblock"
                  aria-label="codeblock"
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                >
                  <CodeIcon className="h-4 w-4" />
                </ToggleGroupItem>

                <ToggleGroupItem
                  value="quoteblock"
                  aria-label="quoteblock"
                  onClick={() =>
                    editor.chain().focus().toggleBlockquote().run()
                  }
                >
                  <QuoteIcon className="h-4 w-4" />
                </ToggleGroupItem>

                <ToggleGroupItem
                  value="bullet"
                  aria-label="bullet"
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                >
                  <ListBulletIcon className="h-4 w-4" />
                </ToggleGroupItem>

                <ToggleGroupItem
                  value="number"
                  aria-label="number"
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                >
                  <ListOrderedIcon className="h-4 w-4" />
                </ToggleGroupItem>
              </>
            )}

            {/* 
            <ToggleGroupItem
              value="aligncenter"
              aria-label="aligncenter"
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
            >
              <TextAlignCenterIcon className="h-4 w-4" />
            </ToggleGroupItem>

            <ToggleGroupItem
              value="alignright"
              aria-label="alignright"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
            >
              <TextAlignRightIcon className="h-4 w-4" />
            </ToggleGroupItem> */}

            {!editor.isActive("imageBlock") && (
              <>
                <DividerVerticalIcon className="h-8 text-gray-600" />

                <ToggleGroupItem
                  value="text-default"
                  aria-label="Toggle text-default"
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .setColor("hsl(var(--foreground))")
                      .run()
                  }
                  data-state={
                    editor.isActive("textStyle", {
                      color: "hsl(var(--foreground))",
                    })
                      ? "on"
                      : "off"
                  }
                >
                  <div
                    className="h-4 w-4"
                    style={{ backgroundColor: "hsl(var(--foreground))" }}
                  />
                </ToggleGroupItem>

                {editorColors.map((c, index) => (
                  <ToggleGroupItem
                    value={`text-${c.name}`}
                    aria-label={`Toggle text-${c.name}`}
                    onClick={() =>
                      editor.chain().focus().setColor(c.colorVar).run()
                    }
                    data-state={
                      editor.isActive("textStyle", { color: c.colorVar })
                        ? "on"
                        : "off"
                    }
                    key={index}
                  >
                    <div
                      className="h-4 w-4"
                      style={{ backgroundColor: c.colorVar }}
                    />
                  </ToggleGroupItem>
                ))}
              </>
            )}

            {/* <div className="Flex flex-row">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link1Icon className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      To create a link, paste a URL on any text.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div> */}
          </ToggleGroup>
        </BubbleMenu>
      </div>
    );
  }
}
