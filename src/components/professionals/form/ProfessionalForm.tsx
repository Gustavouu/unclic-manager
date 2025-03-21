
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type ProfessionalFormData = {
  name: string;
  email: string;
  phone: string;
  role: string;
  specialty: string;
  status: string;
  hireDate: string;
  commission: string;
};

export type ProfessionalFormErrors = {
  [key in keyof ProfessionalFormData]?: string;
};

interface ProfessionalFormProps {
  professionalData: ProfessionalFormData;
  errors: ProfessionalFormErrors;
  onChange: (field: string, value: string) => void;
}

export const ProfessionalForm = ({ professionalData, errors, onChange }: ProfessionalFormProps) => {
  // Roles options
  const roleOptions = [
    "Cabeleireiro(a)",
    "Barbeiro",
    "Esteticista",
    "Manicure",
    "Massagista",
    "Maquiador(a)",
    "Recepcionista"
  ];

  // Specialty options based on role
  const getSpecialtyOptions = (role: string) => {
    switch (role) {
      case "Cabeleireiro(a)":
        return ["Coloração", "Corte", "Penteados", "Tratamentos", "Alisamento"];
      case "Barbeiro":
        return ["Barba", "Corte Masculino", "Tratamentos", "Pigmentação"];
      case "Esteticista":
        return ["Limpeza de Pele", "Massagem", "Depilação", "Tratamentos Corporais"];
      case "Manicure":
        return ["Manicure", "Pedicure", "Unhas em Gel", "Unhas Acrílicas"];
      case "Massagista":
        return ["Relaxante", "Terapêutica", "Drenagem Linfática", "Pedras Quentes"];
      case "Maquiador(a)":
        return ["Social", "Noivas", "Artística", "Editorial"];
      default:
        return [];
    }
  };

  return (
    <div className="grid gap-4 py-4">
      {/* Nome */}
      <div className="grid gap-2">
        <Label htmlFor="name">
          Nome <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          value={professionalData.name}
          onChange={(e) => onChange("name", e.target.value)}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      {/* Email */}
      <div className="grid gap-2">
        <Label htmlFor="email">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={professionalData.email}
          onChange={(e) => onChange("email", e.target.value)}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      {/* Telefone */}
      <div className="grid gap-2">
        <Label htmlFor="phone">
          Telefone <span className="text-destructive">*</span>
        </Label>
        <Input
          id="phone"
          value={professionalData.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          className={errors.phone ? "border-destructive" : ""}
        />
        {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
      </div>

      {/* Função */}
      <div className="grid gap-2">
        <Label htmlFor="role">
          Função <span className="text-destructive">*</span>
        </Label>
        <Select
          value={professionalData.role}
          onValueChange={(value) => {
            onChange("role", value);
            onChange("specialty", "");
          }}
        >
          <SelectTrigger id="role" className={errors.role ? "border-destructive" : ""}>
            <SelectValue placeholder="Selecione uma função" />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
      </div>

      {/* Especialidade */}
      <div className="grid gap-2">
        <Label htmlFor="specialty">
          Especialidade <span className="text-destructive">*</span>
        </Label>
        <Select
          value={professionalData.specialty}
          onValueChange={(value) => onChange("specialty", value)}
          disabled={!professionalData.role}
        >
          <SelectTrigger id="specialty" className={errors.specialty ? "border-destructive" : ""}>
            <SelectValue placeholder="Selecione uma especialidade" />
          </SelectTrigger>
          <SelectContent>
            {getSpecialtyOptions(professionalData.role).map((specialty) => (
              <SelectItem key={specialty} value={specialty}>
                {specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.specialty && <p className="text-sm text-destructive">{errors.specialty}</p>}
      </div>

      {/* Status */}
      <div className="grid gap-2">
        <Label htmlFor="status">
          Status <span className="text-destructive">*</span>
        </Label>
        <Select
          value={professionalData.status}
          onValueChange={(value) => onChange("status", value)}
        >
          <SelectTrigger id="status" className={errors.status ? "border-destructive" : ""}>
            <SelectValue placeholder="Selecione um status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
            <SelectItem value="vacation">Em férias</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
      </div>

      {/* Data de Contratação */}
      <div className="grid gap-2">
        <Label htmlFor="hireDate">
          Data de Contratação <span className="text-destructive">*</span>
        </Label>
        <Input
          id="hireDate"
          type="date"
          value={professionalData.hireDate}
          onChange={(e) => onChange("hireDate", e.target.value)}
          className={errors.hireDate ? "border-destructive" : ""}
        />
        {errors.hireDate && <p className="text-sm text-destructive">{errors.hireDate}</p>}
      </div>

      {/* Comissão */}
      <div className="grid gap-2">
        <Label htmlFor="commission">
          Comissão (%) <span className="text-destructive">*</span>
        </Label>
        <Input
          id="commission"
          type="number"
          min="0"
          max="100"
          value={professionalData.commission}
          onChange={(e) => onChange("commission", e.target.value)}
          className={errors.commission ? "border-destructive" : ""}
        />
        {errors.commission && <p className="text-sm text-destructive">{errors.commission}</p>}
      </div>
    </div>
  );
};
