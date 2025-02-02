import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PrescriptionDialog({ isOpen, onClose, prescription }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList /> Prescription Details
          </DialogTitle>
          <DialogDescription>
            Doctor: {prescription?.doctorName || "N/A"}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          <h3 className="text-lg font-semibold">Medications</h3>
          <div className="lg:max-h-80 sm:max-h-64  overflow-y-auto">
            {prescription?.prescription?.prescriptionData?.length > 0 ? (
                prescription.prescription.prescriptionData.map((med, index) => (
                <div key={index} className="p-3 bg-gray-100 rounded-lg shadow-md mb-2">
                    <p><strong>Medication:</strong> {med.medication}</p>
                    <div className="flex gap-4">
                        <p><strong>Dosage:</strong> {med.dosage}</p>
                        <p><strong>Duration:</strong> {med.duration}</p>
                    </div>
                </div>
                ))
            ) : (
                <p className="text-gray-500">No medications listed.</p>
            )}
          </div>
        </div>
        <Card>
          <CardHeader className="py-1">
            <CardTitle className="text-lg font-semibold">General Info</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Intravenous Therapy:</strong> {prescription?.prescription?.intravenousTherapy || "None"}</p>
            <p><strong>Prescription:</strong> {prescription?.prescription?.prescription || "No data"}</p>
          </CardContent>
        </Card>


        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={onClose}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
