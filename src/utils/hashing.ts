import { blake2b } from "@noble/hashes/blake2b";

export const generateTaskHash = (taskData: {
  title: string;
  description: string;
  acceptanceCriteria: string[];
}) => {
  const dataString = JSON.stringify({
    title: taskData.title,
    description: taskData.description,
    acceptanceCriteria: taskData.acceptanceCriteria,
  });
  // blake2b with 28 bytes (28 * 2 = 56 hex characters)
  return Buffer.from(
    blake2b(new TextEncoder().encode(dataString), { dkLen: 28 }),
  ).toString("hex");
};
