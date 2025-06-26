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
      {/* Botão que abre o diálogo, se fornecido */}
      {triggerButton && (
        <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
          {triggerButton}
        </div>
      )}

      <DialogContent
        className="sm:max-w-[425px] w-full bg-[var(--color-dark)] border border-white/20 rounded-2xl shadow-lg p-6 text-white"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        <form onSubmit={onSubmit} className="flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">{title}</DialogTitle>
            <DialogDescription className="text-white/70 mt-1">{description}</DialogDescription>
          </DialogHeader>

          <div className="mt-6 mb-4 space-y-4">{children}</div>

          <DialogFooter className="flex justify-end gap-3">
            {showCancel && (
              <DialogClose asChild>
                <Button type="button" className="text-red-200 bg-red-500 px-6 py-2">
                  Cancelar
                </Button>
              </DialogClose>
            )}
            <Button type="submit" className="text-green-200 bg-green-500 px-6 py-2">
              {submitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
