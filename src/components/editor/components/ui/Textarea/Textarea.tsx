import { forwardRef } from 'react'
import { cn } from '../../../lib/utils'

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...rest }, ref) => {
    const textAreaClassName = cn(
      'bg-background border-0 rounded-lg caretforeground block text-foreground text-sm font-medium h-[4.5rem] px-2 py-1 w-full',
      'dark:bg-forground dark:text-primary-foreground dark:caretbackground',
      'hover:bg-forground',
      'dark:hover:bg-forground',
      'focus:bg-transparent active:bg-transparent focus:outline focus:outlineforeground active:outline active:outlineforeground',
      'dark:focus:outlinebackground dark:active:outlinebackground',
      className,
    )

    return <textarea className={textAreaClassName} ref={ref} {...rest} />
  },
)

Textarea.displayName = 'Textarea'
