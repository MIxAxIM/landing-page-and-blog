import type { ComponentPropsWithoutRef } from 'react';


import { useComboboxContext } from './context';
import { cn } from '~/utils/shadcn';

export const ComboboxEmpty = ({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'div'>) => {
  const { filteredItems } = useComboboxContext();
  if (filteredItems && filteredItems.length > 0) return null;

  return (
    <div
      {...props}
      className={cn('p-4 text-center text-sm text-muted-foreground', className)}
    >
      {children}
    </div>
  );
};
