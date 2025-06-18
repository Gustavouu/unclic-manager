
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Users, Key, Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  userCount: number;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const PermissionsTab = () => {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "owner",
      name: "Proprietário",
      description: "Acesso total ao sistema",
      permissions: ["all"],
      isSystem: true,
      userCount: 1
    },
    {
      id: "manager",
      name: "Gerente",
      description: "Gerencia funcionários e operações",
      permissions: ["view_dashboard", "manage_appointments", "manage_clients", "view_financial", "manage_staff"],
      isSystem: true,
      userCount: 2
    },
    {
      id: "barber",
      name: "Barbeiro",
      description: "Gerencia próprios agendamentos",
      permissions: ["view_dashboard", "manage_own_appointments", "view_clients", "view_own_schedule"],
      isSystem: true,
      userCount: 3
    },
    {
      id: "receptionist", 
      name: "Recepcionista",
      description: "Gerencia agendamentos e clientes",
      permissions: ["view_dashboard", "manage_appointments", "manage_clients", "view_schedule"],
      isSystem: false,
      userCount: 1
    }
  ]);

  const [permissions] = useState<Permission[]>([
    // Dashboard
    { id: "view_dashboard", name: "Ver Dashboard", description: "Visualizar painel principal", category: "Dashboard" },
    
    // Agendamentos
    { id: "view_appointments", name: "Ver Agendamentos", description: "Visualizar todos os agendamentos", category: "Agendamentos" },
    { id: "manage_appointments", name: "Gerenciar Agendamentos", description: "Criar, editar e cancelar agendamentos", category: "Agendamentos" },
    { id: "manage_own_appointments", name: "Gerenciar Próprios Agendamentos", description: "Gerenciar apenas próprios agendamentos", category: "Agendamentos" },
    { id: "view_schedule", name: "Ver Agenda", description: "Visualizar agenda geral", category: "Agendamentos" },
    { id: "view_own_schedule", name: "Ver Própria Agenda", description: "Visualizar apenas própria agenda", category: "Agendamentos" },
    
    // Clientes
    { id: "view_clients", name: "Ver Clientes", description: "Visualizar lista de clientes", category: "Clientes" },
    { id: "manage_clients", name: "Gerenciar Clientes", description: "Criar, editar e remover clientes", category: "Clientes" },
    { id: "view_client_history", name: "Ver Histórico de Clientes", description: "Visualizar histórico detalhado", category: "Clientes" },
    
    // Financeiro
    { id: "view_financial", name: "Ver Financeiro", description: "Visualizar relatórios financeiros", category: "Financeiro" },
    { id: "manage_financial", name: "Gerenciar Financeiro", description: "Gerenciar transações e relatórios", category: "Financeiro" },
    { id: "view_reports", name: "Ver Relatórios", description: "Visualizar relatórios gerais", category: "Financeiro" },
    
    // Funcionários
    { id: "view_staff", name: "Ver Funcionários", description: "Visualizar lista de funcionários", category: "Funcionários" },
    { id: "manage_staff", name: "Gerenciar Funcionários", description: "Adicionar, editar e remover funcionários", category: "Funcionários" },
    { id: "manage_permissions", name: "Gerenciar Permissões", description: "Alterar permissões de usuários", category: "Funcionários" },
    
    // Configurações
    { id: "view_settings", name: "Ver Configurações", description: "Visualizar configurações do sistema", category: "Configurações" },
    { id: "manage_settings", name: "Gerenciar Configurações", description: "Alterar configurações do sistema", category: "Configurações" },
    
    // Serviços e Produtos
    { id: "view_services", name: "Ver Serviços", description: "Visualizar serviços oferecidos", category: "Serviços" },
    { id: "manage_services", name: "Gerenciar Serviços", description: "Criar, editar e remover serviços", category: "Serviços" },
    { id: "view_inventory", name: "Ver Estoque", description: "Visualizar inventário de produtos", category: "Estoque" },
    { id: "manage_inventory", name: "Gerenciar Estoque", description: "Gerenciar inventário de produtos", category: "Estoque" }
  ]);

  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [showNewRoleForm, setShowNewRoleForm] = useState(false);
  const [newRole, setNewRole] = useState<Partial<Role>>({
    name: "",
    description: "",
    permissions: [],
    isSystem: false
  });

  const permissionCategories = Array.from(new Set(permissions.map(p => p.category)));

  const toggleRolePermission = (roleId: string, permissionId: string) => {
    setRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        const hasPermission = role.permissions.includes(permissionId);
        const newPermissions = hasPermission
          ? role.permissions.filter(p => p !== permissionId)
          : [...role.permissions, permissionId];
        
        return { ...role, permissions: newPermissions };
      }
      return role;
    }));
  };

  const deleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isSystem) {
      toast.error("Não é possível excluir um cargo do sistema");
      return;
    }
    
    setRoles(prev => prev.filter(role => role.id !== roleId));
    toast.success("Cargo removido com sucesso");
  };

  const handleAddRole = () => {
    if (newRole.name && newRole.description) {
      const role: Role = {
        id: Date.now().toString(),
        name: newRole.name,
        description: newRole.description,
        permissions: newRole.permissions || [],
        isSystem: false,
        userCount: 0
      };
      
      setRoles(prev => [...prev, role]);
      setNewRole({ name: "", description: "", permissions: [], isSystem: false });
      setShowNewRoleForm(false);
      toast.success("Cargo criado com sucesso");
    }
  };

  const handleSaveEdit = () => {
    if (editingRole) {
      setRoles(prev => prev.map(role => 
        role.id === editingRole.id ? editingRole : role
      ));
      setEditingRole(null);
      toast.success("Cargo atualizado com sucesso");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Cargos e Permissões
          </CardTitle>
          <CardDescription>
            Configure os cargos e suas respectivas permissões no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Total de cargos: {roles.length}
            </p>
            <Button onClick={() => setShowNewRoleForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cargo
            </Button>
          </div>

          <div className="space-y-4">
            {roles.map((role) => (
              <div key={role.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-gray-500" />
                      <div>
                        <h3 className="font-medium">{role.name}</h3>
                        <p className="text-sm text-gray-600">{role.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">
                            {role.userCount} usuário{role.userCount !== 1 ? 's' : ''}
                          </Badge>
                          {role.isSystem && <Badge variant="secondary">Sistema</Badge>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingRole(role)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {!role.isSystem && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRole(role.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-sm font-medium mb-2">Permissões:</p>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.includes("all") ? (
                      <Badge>Acesso Total</Badge>
                    ) : (
                      role.permissions.map(permissionId => {
                        const permission = permissions.find(p => p.id === permissionId);
                        return permission ? (
                          <Badge key={permissionId} variant="outline" className="text-xs">
                            {permission.name}
                          </Badge>
                        ) : null;
                      })
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form para novo cargo */}
      {showNewRoleForm && (
        <Card>
          <CardHeader>
            <CardTitle>Novo Cargo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newRoleName">Nome do Cargo *</Label>
                <Input
                  id="newRoleName"
                  value={newRole.name}
                  onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Assistente"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="newRoleDescription">Descrição</Label>
              <Input
                id="newRoleDescription"
                value={newRole.description}
                onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva as responsabilidades do cargo"
              />
            </div>

            <div>
              <Label>Permissões</Label>
              <div className="mt-2 space-y-4">
                {permissionCategories.map(category => (
                  <div key={category}>
                    <h4 className="font-medium text-sm mb-2">{category}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {permissions
                        .filter(p => p.category === category)
                        .map(permission => (
                          <div key={permission.id} className="flex items-start space-x-2">
                            <input
                              type="checkbox"
                              id={`new-${permission.id}`}
                              checked={newRole.permissions?.includes(permission.id)}
                              onChange={(e) => {
                                const currentPermissions = newRole.permissions || [];
                                if (e.target.checked) {
                                  setNewRole(prev => ({ 
                                    ...prev, 
                                    permissions: [...currentPermissions, permission.id] 
                                  }));
                                } else {
                                  setNewRole(prev => ({ 
                                    ...prev, 
                                    permissions: currentPermissions.filter(p => p !== permission.id) 
                                  }));
                                }
                              }}
                            />
                            <div>
                              <Label htmlFor={`new-${permission.id}`} className="text-sm font-normal">
                                {permission.name}
                              </Label>
                              <p className="text-xs text-gray-500">{permission.description}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddRole}>Criar Cargo</Button>
              <Button variant="outline" onClick={() => setShowNewRoleForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form para editar cargo */}
      {editingRole && (
        <Card>
          <CardHeader>
            <CardTitle>Editar Cargo - {editingRole.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editRoleName">Nome do Cargo *</Label>
                <Input
                  id="editRoleName"
                  value={editingRole.name}
                  onChange={(e) => setEditingRole(prev => prev ? { ...prev, name: e.target.value } : null)}
                  disabled={editingRole.isSystem}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="editRoleDescription">Descrição</Label>
              <Input
                id="editRoleDescription"
                value={editingRole.description}
                onChange={(e) => setEditingRole(prev => prev ? { ...prev, description: e.target.value } : null)}
                disabled={editingRole.isSystem}
              />
            </div>

            <div>
              <Label>Permissões</Label>
              <div className="mt-2 space-y-4">
                {editingRole.permissions.includes("all") ? (
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center gap-2">
                      <Key className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Acesso Total</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Este cargo tem acesso completo a todas as funcionalidades do sistema.
                    </p>
                  </div>
                ) : (
                  permissionCategories.map(category => (
                    <div key={category}>
                      <h4 className="font-medium text-sm mb-2">{category}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {permissions
                          .filter(p => p.category === category)
                          .map(permission => (
                            <div key={permission.id} className="flex items-start space-x-2">
                              <input
                                type="checkbox"
                                id={`edit-${permission.id}`}
                                checked={editingRole.permissions.includes(permission.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setEditingRole(prev => prev ? { 
                                      ...prev, 
                                      permissions: [...prev.permissions, permission.id] 
                                    } : null);
                                  } else {
                                    setEditingRole(prev => prev ? { 
                                      ...prev, 
                                      permissions: prev.permissions.filter(p => p !== permission.id) 
                                    } : null);
                                  }
                                }}
                                disabled={editingRole.isSystem}
                              />
                              <div>
                                <Label htmlFor={`edit-${permission.id}`} className="text-sm font-normal">
                                  {permission.name}
                                </Label>
                                <p className="text-xs text-gray-500">{permission.description}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveEdit} disabled={editingRole.isSystem}>
                Salvar Alterações
              </Button>
              <Button variant="outline" onClick={() => setEditingRole(null)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Configurações de Segurança</CardTitle>
          <CardDescription>
            Configure políticas de segurança e acesso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Autenticação de dois fatores obrigatória</Label>
              <p className="text-sm text-gray-600">Exigir 2FA para todos os usuários</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Logout automático</Label>
              <p className="text-sm text-gray-600">Deslogar usuários inativos após 30 minutos</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Log de atividades</Label>
              <p className="text-sm text-gray-600">Registrar todas as ações dos usuários</p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div>
            <Label htmlFor="maxLoginAttempts">Máximo de tentativas de login</Label>
            <Input
              id="maxLoginAttempts"
              type="number"
              defaultValue="5"
              className="w-32"
            />
          </div>

          <div>
            <Label htmlFor="passwordExpiry">Expiração de senha (dias)</Label>
            <Input
              id="passwordExpiry"
              type="number"
              defaultValue="90"
              className="w-32"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
