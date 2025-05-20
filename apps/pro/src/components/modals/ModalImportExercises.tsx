// import React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { LoaderCircle } from "lucide-react";
// import { ModalProps } from "@/hooks/useModale";

// const uploadExercisesCSVSchema = z.object({
//   csvFile: z.instanceof(File),
// });
// type UploadCSVFormInputs = z.infer<typeof uploadExercisesCSVSchema>;

// const ModalImportExercises: React.FC<ModalProps> = (props) => {
//   const queryClient = useQueryClient();
//   const uploadExercisesCSV = (data: FormData) => {
//     console.log(data);
//   };
//   const mutation = useMutation({
//     mutationFn: async (data: FormData) => uploadExercisesCSV(data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["exercises"] });
//       close?.();
//     },
//   });

//   const form = useForm<UploadCSVFormInputs>({
//     resolver: zodResolver(uploadExercisesCSVSchema),
//   });

//   const onSubmit = (data: UploadCSVFormInputs) => {
//     const formData = new FormData();
//     formData.append("file", data.csvFile[0]);

//     mutation.mutateAsync(formData);
//     form.reset();
//   };

//   return (
//     <Dialog {...props}>
//       <DialogContent className="w-full max-w-md p-6 flex flex-col">
//         <DialogHeader>
//           <DialogTitle className="text-foreground">
//             Importer des Exercices via CSV
//           </DialogTitle>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="csvFile"
//               render={({ field, fieldState: { error } }) => (
//                 <FormItem>
//                   <FormLabel>Fichier CSV</FormLabel>
//                   <Input
//                     type="file"
//                     accept=".csv"
//                     {...field}
//                     className="mt-1"
//                   />
//                   {error && <FormMessage>{error.message}</FormMessage>}
//                 </FormItem>
//               )}
//             />
//             <Button
//               type="submit"
//               variant="primary"
//               disabled={mutation.isPending}
//             >
//               {mutation.isPending && (
//                 <LoaderCircle className="size-4 animate-spin" />
//               )}
//               <span>Importer le CSV</span>
//             </Button>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ModalImportExercises;
export default function ModalImportExercises() {
  return <div>ModalImportExercises</div>;
}
