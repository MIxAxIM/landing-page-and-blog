import { blake2b } from "blakejs";

// Define types
interface Token {
  symbol: string;
  tokenName: string;
  amount: number;
}

interface ProjectData {
  pdProjectContent: string;
  pdExpirationTime: number;
  pdLovelaceAmount: number;
  pdTokens: Token[];
}

const uint8ArrayToHex = (uint8Array: Uint8Array): string => {
  return Array.from(uint8Array)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const hexToUint8Array = (hex: string): Uint8Array => {
  if (hex.length % 2 !== 0) {
    throw new Error("Hex string must have an even length");
  }
  const array = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    array[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return array;
};

// Helper function to encode integer in Little Endian byte order
const integerToByteString = (num: number): Uint8Array => {
  let hexString = num.toString(16).padStart(2, "0");
  if (hexString.length % 2 !== 0) {
    hexString = "0" + hexString;
  }
  const byteArray = hexToUint8Array(hexString).reverse();
  return byteArray;
};

// Main hash function
const hashProjectData = (projectData: ProjectData): string => {
  const { pdProjectContent, pdExpirationTime, pdLovelaceAmount } = projectData;

  const contentBytes = new TextEncoder().encode(pdProjectContent);

  const contentHex = Array.from(contentBytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  const expirationBytes = integerToByteString(pdExpirationTime);
  const expirationHex = uint8ArrayToHex(expirationBytes);

  const lovelaceBytes = integerToByteString(pdLovelaceAmount);
  const lovelaceHex = uint8ArrayToHex(lovelaceBytes);

  const final = contentHex + expirationHex + lovelaceHex;

  const uint8Array = hexToUint8Array(final);
  const hashBuffer = blake2b(uint8Array, undefined, 32);

  // Convert hash buffer to hex string
  return Array.from(hashBuffer)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const projectData: ProjectData = {
  pdProjectContent: "project data hash qw",
  pdExpirationTime: 12057001, // Example timestamp
  pdLovelaceAmount: 3000000,
  pdTokens: [],
};

const hash = hashProjectData(projectData);
console.log("Hash:", hash);
