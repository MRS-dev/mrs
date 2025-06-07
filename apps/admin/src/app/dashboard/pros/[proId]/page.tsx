"use client";
import React from "react";

export default function Page() {
  // const confirmDeleteModal = useModal();
  // const router = useRouter();
  // const queryClient = useQueryClient();
  // const params = useParams<{ id: string }>();
  // const form = useForm<ProFormInputs>({
  //   resolver: zodResolver(proInputsSchema),
  // });
  // const pro = usePro(params.id);

  // const createProMutation = useMutation({
  //   mutationFn: async (data: ProFormInputs) => createPro(data),
  //   onSuccess: (data) => {
  //     // toast({
  //     //   title: "Pro créé avec succès",
  //     //   variant: "success",
  //     // });
  //     form.reset();
  //     queryClient.invalidateQueries({ queryKey: ["pros", params.id] });
  //     // ionRouter.push(ROUTES.pro(data._id), "none", "replace");
  //   },
  //   // onError: () => {
  //   //   toast({
  //   //     title: "Une erreur est survenue lors de la création",
  //   //     variant: "destructive",
  //   //   });
  //   // },
  // });
  // const updateProMutation = useMutation({
  //   mutationFn: async (data: ProFormInputs) => {
  //     //return await updatePro(params.id, { ...data });
  //   },
  //   onSuccess: () => {
  //     // toast({
  //     //   title: "Pro modifié avec succès",
  //     //   variant: "success",
  //     // });
  //     queryClient.invalidateQueries({ queryKey: ["pros", params.id] });
  //     form.reset();
  //   },
  //   onError: () => {
  //     // toast({
  //     //   title: "Une erreur est survenue lors de la modification",
  //     //   variant: "destructive",
  //     // });
  //   },
  // });

  // const deleteProMutation = useMutation({
  //   mutationFn: async () => {
  //     //return await deletePro(params.id);
  //   },
  //   onSuccess: () => {
  //     // toast({
  //     //   title: "Pro supprimé avec succès",
  //     //   variant: "success",
  //     // });
  //     // ionRouter.push(ROUTES.pros, "none", "replace");
  //     // confirmDeleteModal.close();
  //   },
  //   onError: () => {
  //     // toast({
  //     //   title: "Une erreur est survenue lors de la suppression",
  //     //   variant: "destructive",
  //     // });
  //     // confirmDeleteModal.close();
  //   },
  // });

  // const onSubmit = (data: ProFormInputs) => {
  //   mode === "create"
  //     ? createProMutation.mutate(data)
  //     : updateProMutation.mutate(data);
  // };

  // const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  // const { resetProgram } = useProgramStore();

  // useEffect(() => {
  //   resetProgram();
  // }, []);
  // const isMutating = createProMutation.isPending || updateProMutation.isPending;
  // const isFetching = pro.isFetching;
  // const isLoading = isMutating || isFetching;

  return (
    <div>
      <h1>Pro</h1>
    </div>
    // <SidebarLayout
    //   className="overflow-hidden h-screen"
    //   Header={
    //     <SidebarLayoutHeader>
    //       <div className="flex flex-row items-center gap-2 justify-between flex-1 w-full">
    //         <div className="flex flex-row items-center gap-2">
    //           <h1 className="text-xl font-bold">Kinésithérapeute </h1>
    //           <ChevronRight className="text-muted-foreground size-4" />
    //           <span className="text-xl font-semibold text-primary">
    //             {isLoading ? (
    //               <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
    //             ) : (
    //               //pro?.title || "Nouveau Kinésithérapeute"
    //               "Nouveau Kinésithérapeute"
    //             )}
    //           </span>
    //         </div>
    //         {mode === "edit" && (
    //           <Button
    //             variant="destructive-light"
    //             onClick={() => confirmDeleteModal.open()}
    //           >
    //             <Trash className="size-4" /> Supprimer
    //           </Button>
    //         )}
    //       </div>
    //     </SidebarLayoutHeader>
    //   }
    // >
    //   <div className="flex flex-1 flex-col gap-4 p-4 text-foreground">
    //     <Form {...form}>
    //       {/* <form
    //             onSubmit={form.handleSubmit(onSubmit)}
    //             className="grid gap-4 max-w-xl mx-auto w-full"
    //           >
    //             <FormField
    //               control={form.control}
    //               name="title"
    //               render={({ field, fieldState }) => (
    //                 <FormItem>
    //                   <FormLabel>Titre</FormLabel>
    //                   <Input {...field} type="text" className="!mt-1" />
    //                   {fieldState.error?.message && (
    //                     <FormMessage>{fieldState.error.message}</FormMessage>
    //                   )}
    //                 </FormItem>
    //               )}
    //             />
    //             <FormField
    //               control={form.control}
    //               name="description"
    //               render={({ field, fieldState }) => (
    //                 <FormItem>
    //                   <FormLabel>Description</FormLabel>
    //                   <Textarea {...field} className="!mt-1" rows={5} />
    //                   {fieldState.error?.message && (
    //                     <FormMessage>{fieldState.error.message}</FormMessage>
    //                   )}
    //                 </FormItem>
    //               )}
    //             />
    //             <FormField
    //               control={form.control}
    //               name="bodyPart"
    //               render={({ field, fieldState: { error } }) => (
    //                 <FormItem>
    //                   <FormLabel>Partie du Corps</FormLabel>
    //                   <Select
    //                     {...field}
    //                     onValueChange={field.onChange}
    //                     defaultValue=""
    //                   >
    //                     <SelectTrigger className="w-full max-w-72">
    //                       <SelectValue placeholder="Partie du corps" />
    //                     </SelectTrigger>
    //                     <SelectContent>
    //                       <SelectItem value="Têtes">Têtes</SelectItem>
    //                       <SelectItem value="Cou">Cou</SelectItem>
    //                       <SelectItem value="Tronc">Tronc</SelectItem>
    //                       <SelectItem value="Membres Supérieurs">
    //                         Membres Supérieurs
    //                       </SelectItem>
    //                       <SelectItem value="Membres Inférieurs">
    //                         Membres Inférieurs
    //                       </SelectItem>
    //                     </SelectContent>
    //                   </Select>
    //                   {error && <FormMessage>{error.message}</FormMessage>}
    //                 </FormItem>
    //               )}
    //             />
    //             <div className="grid grid-cols-2 gap-4">
    //               <FormField
    //                 control={form.control}
    //                 name="workType"
    //                 render={({ field, fieldState: { error } }) => (
    //                   <FormItem>
    //                     <FormLabel>Partie du Corps</FormLabel>
    //                     <Select
    //                       {...field}
    //                       onValueChange={field.onChange}
    //                       defaultValue=""
    //                     >
    //                       <SelectTrigger className="w-full">
    //                         <SelectValue placeholder="Partie du corps" />
    //                       </SelectTrigger>
    //                       <SelectContent>
    //                         <SelectItem value="Têtes">Têtes</SelectItem>
    //                         <SelectItem value="Cou">Cou</SelectItem>
    //                         <SelectItem value="Tronc">Tronc</SelectItem>
    //                         <SelectItem value="Membres Supérieurs">
    //                           Membres Supérieurs
    //                         </SelectItem>
    //                         <SelectItem value="Membres Inférieurs">
    //                           Membres Inférieurs
    //                         </SelectItem>
    //                       </SelectContent>
    //                     </Select>
    //                     {error && <FormMessage>{error.message}</FormMessage>}
    //                   </FormItem>
    //                 )}
    //               />
    //               <FormField
    //                 control={form.control}
    //                 name="muscularPart"
    //                 render={({ field, fieldState: { error } }) => (
    //                   <FormItem>
    //                     <FormLabel>Partie du Corps</FormLabel>
    //                     <Select
    //                       {...field}
    //                       onValueChange={field.onChange}
    //                       defaultValue=""
    //                     >
    //                       <SelectTrigger className="w-full">
    //                         <SelectValue placeholder="Partie du corps" />
    //                       </SelectTrigger>
    //                       <SelectContent>
    //                         <SelectItem value="Têtes">Têtes</SelectItem>
    //                         <SelectItem value="Cou">Cou</SelectItem>
    //                         <SelectItem value="Tronc">Tronc</SelectItem>
    //                         <SelectItem value="Membres Supérieurs">
    //                           Membres Supérieurs
    //                         </SelectItem>
    //                         <SelectItem value="Membres Inférieurs">
    //                           Membres Inférieurs
    //                         </SelectItem>
    //                       </SelectContent>
    //                     </Select>
    //                     {error && <FormMessage>{error.message}</FormMessage>}
    //                   </FormItem>
    //                 )}
    //               />
    //             </div>
    //             <div>
    //               <Button
    //                 type="submit"
    //                 className="my-4"
    //                 variant="default"
    //                 size="lg"
    //                 disabled={createProMutation.isPending}
    //               >
    //                 {createProMutation.isPending && (
    //                   <LoaderCircle className="size-4 animate-spin" />
    //                 )}
    //                 <span>{mode === "create" ? "Créer" : "Modifier"}</span>
    //               </Button>
    //             </div>
    //           </form> */}
    //     </Form>
    //     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
    //   </div>
    // </SidebarLayout>
    // <ConfirmationModal
    //   {...confirmDeleteModal}
    //   onContinue={deleteProMutation.mutate}
    //   title="Supprimer l'exercice"
    //   description="Voulez-vous vraiment supprimer ce Kinésithérapeute?"
    //   cancelText="Annuler"
    //   continueText="Supprimer"
    //   continueLoading={deleteProMutation.isPending}
    // />
    // </>
  );
}
