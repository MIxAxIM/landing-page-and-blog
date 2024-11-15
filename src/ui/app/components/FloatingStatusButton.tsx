import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Check, Play, X, HelpingHand, WorkflowIcon, Goal } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from "~/utils/shadcn";
import { Button } from '~/components/ui/button';

interface FloatingActionPopoverProps {
  isCompleted?: boolean;
  defaultOpen?: boolean;
  children?: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  height?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  showCloseButton?: boolean;
}

export default function FloatingStatusButton({
  isCompleted = false,
  defaultOpen = false,
  width = 'lg',
  height = 'lg',
  className,
  showCloseButton = true,
  children
}: FloatingActionPopoverProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  // Width and height mappings
  const widthClasses = {
    sm: 'w-[300px]',
    md: 'w-[500px]',
    lg: 'w-[600px]',
    xl: 'w-[600px]',
    full: 'w-[95vw]'
  };

  const heightClasses = {
    sm: 'h-[200px]',
    md: 'h-[400px]',
    lg: 'h-[400px]',
    xl: 'h-[400px]',
    full: 'h-[90vh]'
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <motion.div
          initial={{ scale: 0 }}
          animate={{
            scale: 1,
            backgroundColor: [
              "#FF66B2",  // Soft neon pink
              "#7C3AED",  // Purple
              "#06B6D4",  // Cyan
              "#FF66B2",  // Back to start
            ]
          }}
          transition={{
            backgroundColor: {
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          className="fixed bottom-[150px] right-5 z-50"
        >
          <Button
            intent="outline"
            className="fixed bottom-[150px] right-5 z-50 rounded-full p-3 bg-inherit"
          >
            {isCompleted ? (
              <Check className="h-6 w-6 shrink-0" />
            ) : (
              <Goal className="h-6 w-6 shrink-0" />
            )}
          </Button>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "p-6 mr-[200px] overflow-auto border border-primary",
          widthClasses[width],
          heightClasses[height],
          className
        )}
        side="top"
        align="end"
        style={{ marginBottom: -80, marginRight: 80 }}
        sideOffset={15}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative h-full w-full"
        >
          {showCloseButton && (
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-0 top-0 p-1 rounded-full hover:bg-accent"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {children}
        </motion.div>
      </PopoverContent>
    </Popover>
  );
};

