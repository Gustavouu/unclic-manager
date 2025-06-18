
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, Edit, Plus, User, Mail, Phone, Calendar } from "lucide-react";
import { toast } from "sonner";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  commission: number;
  isActive: boolean;
  avatar?: string;
  bio: string;
  specialties: string[];
  workingHours: {
    [key: string]: {
      start: string;
      end: string;
      isWorking: boolean;
    };
  };
  permissions: string[];
}

export const StaffTab = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    {
      id: "1",
      name: "João Silva",
      email: "joao@barbershop.com",
      phone: "(11) 99999-9999",
      role: "Barbeiro Senior",
      commission: 50,
      isActive: true,
      bio: "Especialista em cortes clássicos e modernos",
      specialties: ["Corte Masculino", "Barba", "Bigode"],
      workingHours: {
        monday: { start: "09:00", end: "18:00", isWorking: true },
        tuesday: { start: "09:00", end: "18:00", isWorking: true },
        wednesday: { start: "09:00", end: "18:00", isWorking: true },
        thursday: { start: "09:00", end: "18:00", isWorking: true },
        friday: { start: "09:00", end: "18:00", isWorking: true },
        saturday: { start: "09:00", end: "16:00", isWorking: true },
        sunday: { start: "09:00", end: "16:00", isWorking: false }
      },
      permissions: ["view_appointments", "manage_own_schedule", "view_clients"]
    }
  ]);

  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [showNewStaffForm, setShowNewStaffForm] = useState(false);
  const [newStaff, setNewStaff] = useState<Partial<StaffMember>>({
    name: "",
    email: "",
    phone: "",
    role: "Funcionário",
    commission: 40,
    isActive: true,
    bio: "",
    specialties: [],
    permissions: ["view_appointments"]
  });

  const roles = [
    "Proprietário",
    "Gerente", 
    "Barbeiro Senior",
    "Barbeiro",
    "Funcionário",
    "Recepcionista"
  ];

  const availablePermissions = [
    { id: "view_appointments", name: "Ver agendamentos" },
    { id: "manage_appointments", name: "Gerenciar agendamentos" },
    { id: "manage_own_schedule", name: "Gerenciar própria agenda" },
    { id: "view_clients", name: "Ver clientes" },
    { id: "manage_clients", name: "Gerenciar clientes" },
    { id: "view_financial", name: "Ver financeiro" },
    { id: "manage_financial", name: "Gerenciar financeiro" },
    { id: "manage_staff", name: "Gerenciar funcionários" },
    { id: "view_reports", name: "Ver relatórios" },
    { id: "manage_settings", name: "Gerenciar configurações" }
  ];

  const dayNames = {
    monday: "Segunda",
    tuesday: "Terça", 
    wednesday: "Quarta",
    thursday: "Quinta",
    friday: "Sexta",
    saturday: "Sábado",
    sunday: "Domingo"
  };

  const toggleStaffStatus = (id: string) => {
    setStaffMembers(prev => prev.map(staff => 
      staff.id === id ? { ...staff, isActive: !staff.isActive } : staff
    ));
    toast.success("Status do funcionário atualizado");
  };

  const deleteStaff = (id: string) => {
    setStaffMembers(prev => prev.filter(staff => staff.id !== id));
    toast.success("Funcionário removido");
  };

  const handleEditStaff = (staff: StaffMember) => {
    setEditingStaff(staff);
  };

  const handleSaveEdit = () => {
    if (editingStaff) {
      setStaffMembers(prev => prev.map(staff => 
        staff.id === editingStaff.id ? editingStaff : staff
      ));
      setEditingStaff(null);
      toast.success("Funcionário atualizado");
    }
  };

  const handleAddStaff = () => {
    if (newStaff.name && newStaff.email) {
      const staff: StaffMember = {
        id: Date.now().toString(),
        name: newStaff.name,
        email: newStaff.email,
        phone: newStaff.phone || "",
        role: newStaff.role || "Funcionário",
        commission: newStaff.commission || 40,
        isActive: newStaff.isActive ?? true,
        bio: newStaff.bio || "",
        specialties: newStaff.specialties || [],
        workingHours: {
          monday: { start: "09:00", end: "18:00", isWorking: true },
          tuesday: { start: "09:00", end: "18:00", isWorking: true },
          wednesday: { start: "09:00", end: "18:00", isWorking: true },
          thursday: { start: "09:00", end: "18:00", isWorking: true },
          friday: { start: "09:00", end: "18:00", isWorking: true },
          saturday: { start: "09:00", end: "16:00", isWorking: true },
          sunday: { start: "09:00", end: "16:00", isWorking: false }
        },
        permissions: newStaff.permissions || ["view_appointments"]
      };
      
      setStaffMembers(prev => [...prev, staff]);
      setNewStaff({
        name: "",
        email: "",
        phone: "",
        role: "Funcionário",
        commission: 40,
        isActive: true,
        bio: "",
        specialties: [],
        permissions: ["view_appointments"]
      });
      setShowNewStaffForm(false);
      toast.success("Funcionário adicionado");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Equipe</CardTitle>
          <CardDescription>
            Gerencie os funcionários e suas permissões
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Total de funcionários: {staffMembers.length} ({staffMembers.filter(s => s.isActive).length} ativos)
            </p>
            <Button onClick={() => setShowNewStaffForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Funcionário
            </Button>
          </div>

          <div className="space-y-4">
            {staffMembers.map((staff) => (
              <div key={staff.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={staff.avatar} />
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{staff.name}</h3>
                      <p className="text-sm text-gray-600">{staff.role}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {staff.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {staff.phone}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">Comissão: {staff.commission}%</Badge>
                        {!staff.isActive && <Badge variant="destructive">Inativo</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStaffStatus(staff.id)}
                    >
                      {staff.isActive ? "Desativar" : "Ativar"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditStaff(staff)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteStaff(staff.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form para novo funcionário */}
      {showNewStaffForm && (
        <Card>
          <CardHeader>
            <CardTitle>Novo Funcionário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newStaffName">Nome Completo *</Label>
                <Input
                  id="newStaffName"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: João Silva"
                />
              </div>
              <div>
                <Label htmlFor="newStaffEmail">Email *</Label>
                <Input
                  id="newStaffEmail"
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="joao@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newStaffPhone">Telefone</Label>
                <Input
                  id="newStaffPhone"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <Label htmlFor="newStaffRole">Cargo</Label>
                <Select 
                  value={newStaff.role} 
                  onValueChange={(value) => setNewStaff(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="newStaffBio">Biografia</Label>
              <Textarea
                id="newStaffBio"
                value={newStaff.bio}
                onChange={(e) => setNewStaff(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Conte sobre a experiência e especialidades..."
              />
            </div>

            <div>
              <Label htmlFor="newStaffCommission">Comissão (%)</Label>
              <Input
                id="newStaffCommission"
                type="number"
                value={newStaff.commission}
                onChange={(e) => setNewStaff(prev => ({ ...prev, commission: parseInt(e.target.value) }))}
                className="w-32"
              />
            </div>

            <div>
              <Label>Permissões</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availablePermissions.map(permission => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={permission.id}
                      checked={newStaff.permissions?.includes(permission.id)}
                      onChange={(e) => {
                        const currentPermissions = newStaff.permissions || [];
                        if (e.target.checked) {
                          setNewStaff(prev => ({ 
                            ...prev, 
                            permissions: [...currentPermissions, permission.id] 
                          }));
                        } else {
                          setNewStaff(prev => ({ 
                            ...prev, 
                            permissions: currentPermissions.filter(p => p !== permission.id) 
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={permission.id} className="text-sm">
                      {permission.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddStaff}>Adicionar Funcionário</Button>
              <Button variant="outline" onClick={() => setShowNewStaffForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form para editar funcionário */}
      {editingStaff && (
        <Card>
          <CardHeader>
            <CardTitle>Editar Funcionário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editStaffName">Nome Completo *</Label>
                <Input
                  id="editStaffName"
                  value={editingStaff.name}
                  onChange={(e) => setEditingStaff(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              <div>
                <Label htmlFor="editStaffEmail">Email *</Label>
                <Input
                  id="editStaffEmail"
                  type="email"
                  value={editingStaff.email}
                  onChange={(e) => setEditingStaff(prev => prev ? { ...prev, email: e.target.value } : null)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editStaffPhone">Telefone</Label>
                <Input
                  id="editStaffPhone"
                  value={editingStaff.phone}
                  onChange={(e) => setEditingStaff(prev => prev ? { ...prev, phone: e.target.value } : null)}
                />
              </div>
              <div>
                <Label htmlFor="editStaffRole">Cargo</Label>
                <Select 
                  value={editingStaff.role} 
                  onValueChange={(value) => setEditingStaff(prev => prev ? { ...prev, role: value } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="editStaffBio">Biografia</Label>
              <Textarea
                id="editStaffBio"
                value={editingStaff.bio}
                onChange={(e) => setEditingStaff(prev => prev ? { ...prev, bio: e.target.value } : null)}
              />
            </div>

            <div>
              <Label htmlFor="editStaffCommission">Comissão (%)</Label>
              <Input
                id="editStaffCommission"
                type="number"
                value={editingStaff.commission}
                onChange={(e) => setEditingStaff(prev => prev ? { ...prev, commission: parseInt(e.target.value) } : null)}
                className="w-32"
              />
            </div>

            <div>
              <Label>Horários de Trabalho</Label>
              <div className="space-y-2 mt-2">
                {Object.entries(editingStaff.workingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-20">
                      <span className="text-sm">{dayNames[day as keyof typeof dayNames]}</span>
                    </div>
                    <Switch
                      checked={hours.isWorking}
                      onCheckedChange={(checked) => 
                        setEditingStaff(prev => prev ? {
                          ...prev,
                          workingHours: {
                            ...prev.workingHours,
                            [day]: { ...hours, isWorking: checked }
                          }
                        } : null)
                      }
                    />
                    {hours.isWorking && (
                      <>
                        <Input
                          type="time"
                          value={hours.start}
                          onChange={(e) => 
                            setEditingStaff(prev => prev ? {
                              ...prev,
                              workingHours: {
                                ...prev.workingHours,
                                [day]: { ...hours, start: e.target.value }
                              }
                            } : null)
                          }
                          className="w-32"
                        />
                        <span>às</span>
                        <Input
                          type="time"
                          value={hours.end}
                          onChange={(e) => 
                            setEditingStaff(prev => prev ? {
                              ...prev,
                              workingHours: {
                                ...prev.workingHours,
                                [day]: { ...hours, end: e.target.value }
                              }
                            } : null)
                          }
                          className="w-32"
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Permissões</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availablePermissions.map(permission => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`edit-${permission.id}`}
                      checked={editingStaff.permissions.includes(permission.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEditingStaff(prev => prev ? { 
                            ...prev, 
                            permissions: [...prev.permissions, permission.id] 
                          } : null);
                        } else {
                          setEditingStaff(prev => prev ? { 
                            ...prev, 
                            permissions: prev.permissions.filter(p => p !== permission.id) 
                          } : null);
                        }
                      }}
                    />
                    <Label htmlFor={`edit-${permission.id}`} className="text-sm">
                      {permission.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveEdit}>Salvar Alterações</Button>
              <Button variant="outline" onClick={() => setEditingStaff(null)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
