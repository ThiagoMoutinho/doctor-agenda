import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ClinicForm from "./_components/form";

const ClinicFormPage = () => {
  return (
    <div>
      <Dialog open={true} modal={true}>
        <form>
          <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Adicione uma clínica</DialogTitle>
              <DialogDescription>
                Adicione uma clínica para continuar
              </DialogDescription>
            </DialogHeader>
            <ClinicForm />
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default ClinicFormPage;
