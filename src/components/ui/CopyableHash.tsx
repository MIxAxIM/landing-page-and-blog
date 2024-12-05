import { Button } from "~/components/ui/button"
import { Check, Copy } from "lucide-react"
import { useState } from "react"

export default function CopyableTruncatedHash({ hash }: { hash: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(hash)
      setCopied(true)
      setTimeout(() => setCopied(false), 1000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <Button
      intent="ghost"
      size="sm"
      className="h-6 px-2 font-mono hover:bg-slate-100"
      onClick={copyToClipboard}
    >
      {`${hash.slice(0, 8)}...${hash.slice(-8)}`}
      {copied ? (
        <Check className="ml-2 h-3 w-3 text-green-600" />
      ) : (
        <Copy className="ml-2 h-3 w-3 text-gray-400" />
      )}
    </Button>
  )
}
