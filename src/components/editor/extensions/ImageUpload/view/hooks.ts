// TODO:
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { type Editor } from "@tiptap/react";
import { v4 as uuid } from "uuid";
import {
  type DragEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";

export const useUploader = ({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) => {
  const [loading, setLoading] = useState(false);

  const uploadFile = useCallback(
    async (file: any) => {
      setLoading(true);
      try {
        const postid = uuid();
        const blob = file.slice(0, file.size, file.type);
        const newFile = new File([blob], `${postid}-${file.name}`, {
          type: file.type,
        });
        const formData = new FormData();
        formData.append("file", newFile);
        formData.append("name", newFile.name);

        try {
          const response = await fetch("/api/gcp/upload", {
            method: "POST",
            body: formData,
          });
          if (response.ok) {
            const data = await response.json();
            onUpload(data.url);
          } else {
            throw new Error("Upload failed");
          }
        } catch (error) {
          toast.error((error as Error).message || "Something went wrong");
        }
      } catch (errPayload: any) {
        const error =
          errPayload?.response?.data?.error || "Something went wrong";
        toast.error(error);
      }
      setLoading(false);
    },
    [onUpload],
  );

  return { loading, uploadFile };
};

export const useFileUpload = () => {
  const fileInput = useRef<HTMLInputElement>(null);

  const handleUploadClick = useCallback(() => {
    fileInput.current?.click();
  }, []);

  return { ref: fileInput, handleUploadClick };
};

export const useDropZone = ({
  uploader,
}: {
  uploader: (file: File) => void;
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggedInside, setDraggedInside] = useState<boolean>(false);

  useEffect(() => {
    const dragStartHandler = () => {
      setIsDragging(true);
    };

    const dragEndHandler = () => {
      setIsDragging(false);
    };

    document.body.addEventListener("dragstart", dragStartHandler);
    document.body.addEventListener("dragend", dragEndHandler);

    return () => {
      document.body.removeEventListener("dragstart", dragStartHandler);
      document.body.removeEventListener("dragend", dragEndHandler);
    };
  }, []);

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      setDraggedInside(false);
      if (e.dataTransfer.files.length === 0) {
        return;
      }

      const fileList = e.dataTransfer.files;

      const files: File[] = [];

      for (let i = 0; i < fileList.length; i += 1) {
        const item = fileList.item(i);
        if (item) {
          files.push(item);
        }
      }

      if (files.some((file) => file.type.indexOf("image") === -1)) {
        return;
      }

      e.preventDefault();

      const filteredFiles = files.filter((f) => f.type.indexOf("image") !== -1);

      const file = filteredFiles.length > 0 ? filteredFiles[0] : undefined;

      if (file) {
        uploader(file);
      }
    },
    [uploader],
  );

  const onDragEnter = () => {
    setDraggedInside(true);
  };

  const onDragLeave = () => {
    setDraggedInside(false);
  };

  return { isDragging, draggedInside, onDragEnter, onDragLeave, onDrop };
};

export const usePaste = ({ editor }: { editor: Editor }) => {
  const onUpload = useCallback(
    (url: string) => {
      if (url) {
        editor
          .chain()
          .setImageBlock({ src: url })
          // .deleteRange({ from: getPos(), to: getPos() })
          .focus()
          .run();
      }
    },
    [editor],
  );

  const { uploadFile, loading: isLoadingPastedImage } = useUploader({
    onUpload,
  });

  const onPaste = useCallback(
    async (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("application/octet-stream")) {
          const blob = item.getAsFile();
          if (blob) {
            const buffer = await blob.arrayBuffer();
            const imageType = await getImageType(buffer);
            if (imageType) {
              const imageFile = new File(
                [buffer],
                `pasted-image.${imageType}`,
                {
                  type: `image/${imageType}`,
                },
              );
              void uploadFile(imageFile);
            }
          }
        } else if (item.type.startsWith("image")) {
          const file = item.getAsFile();
          if (file) {
            void uploadFile(file);
          }
        }
      }
    },
    [uploadFile],
  );

  return { onPaste, isLoadingPastedImage };
};

// Helper function to determine the image type
const getImageType = async (buffer: ArrayBuffer) => {
  const byteArray = new Uint8Array(buffer);

  if (
    byteArray[0] === 0xff &&
    byteArray[1] === 0xd8 &&
    byteArray[byteArray.length - 2] === 0xff &&
    byteArray[byteArray.length - 1] === 0xd9
  ) {
    return "jpeg";
  } else if (
    byteArray[0] === 0x89 &&
    byteArray[1] === 0x50 &&
    byteArray[2] === 0x4e &&
    byteArray[3] === 0x47
  ) {
    return "png";
  } else if (
    byteArray[0] === 0x47 &&
    byteArray[1] === 0x49 &&
    byteArray[2] === 0x46
  ) {
    return "gif";
  } else if (byteArray[0] === 0x42 && byteArray[1] === 0x4d) {
    return "bmp";
  } else if (
    byteArray[0] === 0x52 &&
    byteArray[1] === 0x49 &&
    byteArray[2] === 0x46 &&
    byteArray[3] === 0x46
  ) {
    return "webp";
  }

  return null; // Unknown image type
};
