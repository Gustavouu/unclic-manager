
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Facebook, Instagram, Linkedin, Twitter, Globe } from "lucide-react";
import { useBusinessProfileForm } from "@/hooks/useBusinessProfileForm";
import { LogoImagesSection } from "./LogoImagesSection";

export const BusinessProfileCard = () => {
  const {
    getFieldValue,
    updateField,
    getFieldError,
    hasFieldBeenTouched,
    isSaving,
    handleSave,
    handleCancel
  } = useBusinessProfileForm();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações Gerais</CardTitle>
          <CardDescription>
            Informações básicas sobre o seu negócio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessName">Nome do Negócio *</Label>
              <Input
                id="businessName"
                value={getFieldValue("businessName")}
                onChange={(e) => updateField("businessName", e.target.value)}
                placeholder="Nome Fantasia"
              />
              {getFieldError("businessName") && (
                <p className="text-sm text-red-500 mt-1">{getFieldError("businessName")}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="businessEmail">Email de Contato *</Label>
              <Input
                id="businessEmail"
                type="email"
                value={getFieldValue("businessEmail")}
                onChange={(e) => updateField("businessEmail", e.target.value)}
                placeholder="contato@seunegocio.com"
              />
              {getFieldError("businessEmail") && (
                <p className="text-sm text-red-500 mt-1">{getFieldError("businessEmail")}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessPhone">Telefone *</Label>
              <Input
                id="businessPhone"
                value={getFieldValue("businessPhone")}
                onChange={(e) => updateField("businessPhone", e.target.value)}
                placeholder="(11) 99999-9999"
              />
              {getFieldError("businessPhone") && (
                <p className="text-sm text-red-500 mt-1">{getFieldError("businessPhone")}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={getFieldValue("website")}
                onChange={(e) => updateField("website", e.target.value)}
                placeholder="https://seunegocio.com.br"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="businessAddress">Endereço Completo</Label>
            <Input
              id="businessAddress"
              value={getFieldValue("businessAddress")}
              onChange={(e) => updateField("businessAddress", e.target.value)}
              placeholder="Rua, número, bairro, cidade, estado, CEP"
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição do Negócio</Label>
            <Textarea
              id="description"
              value={getFieldValue("description")}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Descreva seu negócio..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Redes Sociais</CardTitle>
          <CardDescription>
            Links para suas redes sociais e presença online
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Label htmlFor="facebookLink">Facebook</Label>
              <div className="relative">
                <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="facebookLink"
                  value={getFieldValue("facebookLink")}
                  onChange={(e) => updateField("facebookLink", e.target.value)}
                  placeholder="https://facebook.com/seunegocio"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="relative">
              <Label htmlFor="instagramLink">Instagram</Label>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="instagramLink"
                  value={getFieldValue("instagramLink")}
                  onChange={(e) => updateField("instagramLink", e.target.value)}
                  placeholder="@seuinstagram"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Label htmlFor="linkedinLink">LinkedIn</Label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="linkedinLink"
                  value={getFieldValue("linkedinLink")}
                  onChange={(e) => updateField("linkedinLink", e.target.value)}
                  placeholder="https://linkedin.com/company/seunegocio"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="relative">
              <Label htmlFor="twitterLink">Twitter</Label>
              <div className="relative">
                <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="twitterLink"
                  value={getFieldValue("twitterLink")}
                  onChange={(e) => updateField("twitterLink", e.target.value)}
                  placeholder="@seutwitter"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <LogoImagesSection />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  );
};
