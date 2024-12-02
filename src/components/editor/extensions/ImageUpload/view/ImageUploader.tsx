import { Spinner } from "../../../components/ui/Spinner";
import { useDropZone, useFileUpload, useUploader } from "./hooks";
import { Icon } from "../../../components/ui/Icon";
import { cn } from "../../../lib/utils";
import { type ChangeEvent, useCallback, useEffect } from "react";

export const ImageUploader = ({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) => {
  const { loading, uploadFile } = useUploader({ onUpload });
  const { ref } = useFileUpload();
  const { draggedInside, onDrop, onDragEnter, onDragLeave } = useDropZone({
    uploader: uploadFile,
  });

  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      e.target.files ? uploadFile(e.target.files[0]) : null,
    [uploadFile],
  );

  const onPaste = useCallback(
    (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image")) {
          const file = item.getAsFile();
          if (file) {
            void uploadFile(file); // Use your existing upload function
          }
        }
      }
    },
    [uploadFile],
  );

  useEffect(() => {
    document.addEventListener("paste", onPaste);

    return () => {
      document.removeEventListener("paste", onPaste);
    };
  }, [onPaste]);

  if (loading) {
    return (
      <div className="flex min-h-[10rem] items-center justify-center rounded-lg bg-opacity-80 p-8">
        <Spinner className="text-neutral-500" size={1.5} />
      </div>
    );
  }

  const wrapperClass = cn(
    "flex flex-col items-center justify-center px-8 py-10 rounded-lg bg-opacity-80",
    draggedInside && "bg-neutral-100",
  );

  return (
    <div
      className={wrapperClass}
      onDrop={onDrop}
      onDragOver={onDragEnter}
      onDragLeave={onDragLeave}
      contentEditable={false}
    >
      <Icon
        name="Image"
        className="mb-4 h-12 w-12 text-foreground opacity-20 dark:text-primary-foreground"
      />
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="text-center text-sm font-medium text-neutral-400 dark:text-neutral-500">
          {draggedInside
            ? "Drop image file here."
            : "Drag and drop or press CTRL-V / CMD-V to paste an image from your clipboard."}
        </div>
        {/* <div>
          <Button
            disabled={draggedInside}
            onClick={handleUploadClick}
            variant="primary"
            buttonSize="small"
          >
            <Icon name="Upload" />
            Upload an image
          </Button>
        </div> */}
      </div>
      <input
        className="h-0 w-0 overflow-hidden opacity-0"
        ref={ref}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.gif"
        onChange={onFileChange}
      />
    </div>
  );
};

export default ImageUploader;
