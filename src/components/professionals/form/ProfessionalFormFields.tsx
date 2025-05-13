
import { UseFormReturn } from "react-hook-form";
import { ProfessionalFormData } from "@/hooks/professionals/types";
import { ImageUpload } from "./components/ImageUpload";
import { PersonalInfo } from "./components/PersonalInfo";
import { SpecialtiesSelect } from "./components/SpecialtiesSelect";

interface ProfessionalFormFieldsProps {
  form: UseFormReturn<ProfessionalFormData>;
  specialties: string[];
  editMode?: boolean;
  initialPhotoUrl?: string;
}

export const ProfessionalFormFields = ({ 
  form, 
  specialties = [],
  editMode = false,
  initialPhotoUrl = "" 
}: ProfessionalFormFieldsProps) => {
  const name = form.watch("name") || "";
  
  return (
    <>
      <ImageUpload 
        form={form} 
        initialPhotoUrl={initialPhotoUrl} 
        name={name} 
      />
      
      <PersonalInfo form={form} />
      
      <SpecialtiesSelect form={form} specialties={specialties} />
    </>
  );
};
