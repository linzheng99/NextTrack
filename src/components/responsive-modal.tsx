import { useMedia } from 'react-use'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer'

interface ResponsiveModalProps {
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ResponsiveModal({
  children,
  open,
  onOpenChange
}: ResponsiveModalProps) {
  const isDesktop = useMedia('(min-width: 1024px)', true)
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-lg p-0 overflow-y-auto max-h-[85vh] hide-scrollbar">
          <DialogTitle className='hidden' />
          {children}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="border-none p-0">
        <div className="overflow-y-auto max-h-[85vh] hide-scrollbar">
        <DrawerTitle className="hidden" />
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
