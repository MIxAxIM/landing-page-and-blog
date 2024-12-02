import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
// import { type NodeViewRendererProps } from "@tiptap/core";
// import { toHtml } from "hast-util-to-html";

// -- Start Codeblock Config
// Languages
import { common, createLowlight } from "lowlight";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import go from "highlight.js/lib/languages/go";
// import bash from "highlight.js/lib/languages/bash";
import python from "highlight.js/lib/languages/python";
import haskell from "highlight.js/lib/languages/haskell";
import json from "highlight.js/lib/languages/json";

const lowlight = createLowlight(common);
lowlight.register({ javascript });
lowlight.register({ typescript });
lowlight.register({ go });
// lowlight.register({ bash });
lowlight.register({ python });
lowlight.register({ haskell });
lowlight.register({ json });
// enable rust for aiken highlighting
// or is aiken addedes

// -- END Codeblock Config

// const CodeBlockWithCopyButton = CodeBlockLowlight.extend({
//   addNodeView() {
//     return (props: NodeViewRendererProps) => {
//       const codeElement: HTMLElement = document.createElement("code");
//       const preElement: HTMLElement = document.createElement("pre");
//       const wrapperElement: HTMLElement = document.createElement("div");
//       const copyButton: HTMLElement = document.createElement("button");
//
//       // Add necessary classes
//       wrapperElement.classList.add("code-block-wrapper");
//       codeElement.classList.add("code-content");
//       copyButton.classList.add("copy-button");
//       copyButton.textContent = "copy";
//
//       // Handle node content safely
//       const highlightedCode = lowlight.highlightAuto(
//         props.node.textContent || "",
//       );
//       codeElement.innerHTML = toHtml(highlightedCode);
//
//       // Add event listener for copy button
//       copyButton.addEventListener("click", () => {
//         navigator.clipboard
//           .writeText(codeElement.textContent ?? "")
//           .then(() => {
//             copyButton.textContent = "copied!";
//             setTimeout(() => (copyButton.textContent = "copy"), 2000);
//           })
//           .catch(() => {
//             copyButton.textContent = "error";
//           });
//       });
//
//       // Append code element and button to the wrapper
//       preElement.appendChild(codeElement);
//       wrapperElement.appendChild(copyButton);
//       wrapperElement.appendChild(preElement);
//
//       // Return the node view object with dom
//       return {
//         dom: wrapperElement,
//         contentDOM: null, // No contentDOM needed since CodeBlock is not editable
//       };
//     };
//   },
// });
//
// export const PublishedCodeBlock = CodeBlockWithCopyButton.configure({
//   lowlight,
//   defaultLanguage: "bash",
// });

export const EditableCodeBlock = CodeBlockLowlight.configure({
  lowlight,
  defaultLanguage: "bash",
});
