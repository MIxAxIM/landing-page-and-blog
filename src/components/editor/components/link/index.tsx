import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";

/**
 * goal is to replace <a> with <Link>
 * but `addNodeView` dont seems to work
 * even though its `completed` https://github.com/ueberdosis/tiptap/issues/1669
 */
export const TipTapLink = ({ node }: NodeViewProps) => {
  const href = node.attrs.href ?? "";

  return (
    <NodeViewWrapper>
      <a href={href} target="_blank" rel="noopener noreferrer">
        {node.textContent}
      </a>
    </NodeViewWrapper>
  );
};
