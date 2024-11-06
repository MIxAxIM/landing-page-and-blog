import { Underline } from "@tiptap/extension-underline";
import Bold from "@tiptap/extension-bold";
import {
  StarterKit,
  Link,
  Heading,
  SlashCommand,
  ImageUpload,
  ImageBlock,
  TextAlign,
} from "./extensions";
import { BubbleMenu } from "@tiptap/extension-bubble-menu";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { TipTapLink } from "./components/link";

const CustomBold = Bold.extend({
  renderHTML({ HTMLAttributes }) {
    return ["b", HTMLAttributes, 0];
  },
});

const CustomLink = Link.extend({
  openOnClick: false,
  addNodeView() {
    return ReactNodeViewRenderer(TipTapLink);
  },
});

export function ExtensionKit() {
  return [
    StarterKit.configure({
      // codeBlock: false,
      // implement custom code next
      // code: false,
    }),
    Underline,
    CustomBold,
    CustomLink,
    Heading.configure({
      levels: [1, 2, 3, 4, 5, 6],
    }),
    SlashCommand,
    ImageUpload.configure({
      clientId: "provider?.document?.clientID",
    }),
    ImageBlock,
    BubbleMenu,
    Color,
    TextStyle,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
  ];
}
