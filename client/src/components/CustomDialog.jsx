// components/CustomDialog.jsx
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function CustomDialog({
  open,
  setOpen,
  title = 'Título',
  description = 'Descrição do diálogo.',
  children,
  onSubmit,
  submitText = 'Salvar',
  showCancel = true,
  triggerButton = null,
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerButton && <div onClick={() => setOpen(true)}>{triggerButton}</div>}

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 mt-4">{children}</div>

          <DialogFooter className="mt-4">
            {showCancel && (
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </DialogClose>
            )}
            <Button type="submit">{submitText}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
