import React, { useState, useRef } from "react";
import { FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Trash2, Upload } from "lucide-react";
import Image from "next/image";
interface MrsFileUploadAreaProps {
  accept: string; // Types de fichiers acceptés, ex : "image/*"
  maxFiles?: number; // Nombre maximum de fichiers
  maxFileSizeMB?: number; // Taille maximale par fichier en MB
  multiple?: boolean; // Autoriser plusieurs fichiers
  onChange: (files: File[]) => void; // Callback avec les métadonnées des fichiers sélectionnés
}

const MrsFileUploadArea: React.FC<MrsFileUploadAreaProps> = ({
  accept,
  maxFiles = 1,
  maxFileSizeMB = 500,
  multiple = false,
  onChange,
}) => {
  const [previewFiles, setPreviewFiles] = useState<
    { src: string; file: File }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null); // Référence pour réinitialiser l'input

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);

    if (!multiple) {
      if (fileArray.length > 1) {
        setError("Vous ne pouvez télécharger qu'un seul fichier.");
        return;
      }
    }

    if (fileArray.length > maxFiles) {
      setError(
        `Vous ne pouvez télécharger que ${maxFiles} fichier(s) maximum.`
      );
      return;
    }

    const oversizedFiles = fileArray.filter(
      (file) => file.size > maxFileSizeMB * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      setError(
        `Certains fichiers dépassent la taille maximale de ${maxFileSizeMB}MB.`
      );
      return;
    }

    const invalidFiles = fileArray.filter(
      (file) => !file.type.startsWith(accept.split("/")[0])
    );
    if (invalidFiles.length > 0) {
      setError("Certains fichiers sélectionnés ne sont pas valides.");
      return;
    }

    setError(null);

    const newFiles = fileArray.map((file) => ({
      src: URL.createObjectURL(file),
      file,
    }));

    if (multiple) {
      setPreviewFiles((prev) => [...prev, ...newFiles]);
      onChange([
        ...previewFiles.map(({ file }) => file),
        ...newFiles.map(({ file }) => file),
      ]);
    } else {
      setPreviewFiles(newFiles);
      onChange(newFiles.map(({ file }) => file));
    }

    // Réinitialiser l'input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);

    // Réinitialiser l'input après ajout
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    setPreviewFiles((prev) => {
      const updatedFiles = [...prev];
      updatedFiles.splice(index, 1);
      onChange(updatedFiles.map(({ file }) => file));
      return updatedFiles;
    });

    // Réinitialiser l'input après suppression
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={cn(
          "border border-dashed border-neutral-200 bg-muted p-4 flex flex-col items-center justify-center rounded-xl text-center",
          "hover:border-primary transition-colors relative hover:bg-primary/10",
          error ? "border-red-500" : ""
        )}
      >
        <div className="bg-primary/10 rounded-full p-4 aspect-square flex items-center justify-center mb-3">
          <Upload className="size-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-xs mb-2 max-w-48">
          Glissez-déposez votre/vos fichier(s) ici, ou cliquez pour
          sélectionner.
        </p>
        <p className="text-muted-foreground/50 text-[0.6rem]">
          Types acceptés : {accept} | Taille max : {maxFileSizeMB}MB par fichier
        </p>
        <input
          ref={inputRef} // Associez l'input à la référence
          type="file"
          accept={accept}
          multiple={multiple}
          className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleInputChange}
        />
      </div>
      {error && <FormMessage>{error}</FormMessage>}

      {previewFiles.length > 0 && (
        <div className="flex flex-wrap flex-row gap-2 mt-2">
          {previewFiles.map((file, index) => (
            <div
              key={index}
              className="relative group border border-neutral-200 rounded-xl h-20 w-20 bg-muted"
            >
              <button
                className="absolute bottom-1 right-1 bg-red-500/10 rounded-full p-1"
                type="button"
                onClick={() => handleRemove(index)}
              >
                <Trash2 className="size-4 text-red-500" />
              </button>
              <Image
                src={file.src}
                alt={`preview-${index}`}
                width={300}
                height={300}
                className="h-20 w-20 object-contain rounded-xl"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MrsFileUploadArea;
