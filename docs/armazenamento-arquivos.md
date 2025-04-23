# Sistema de Armazenamento de Arquivos

Este documento detalha o sistema de armazenamento de arquivos implementado no UnCliC Manager, utilizando o Supabase Storage.

## Sumário

- [Visão Geral](#visão-geral)
- [Estrutura de Buckets](#estrutura-de-buckets)
- [Políticas de Acesso](#políticas-de-acesso)
- [Implementação no Frontend](#implementação-no-frontend)
- [Gerenciamento de Arquivos](#gerenciamento-de-arquivos)
- [Processamento de Imagens](#processamento-de-imagens)
- [Melhores Práticas](#melhores-práticas)
- [Exemplos de Implementação](#exemplos-de-implementação)

## Visão Geral

O UnCliC Manager utiliza o Supabase Storage para armazenamento de arquivos, oferecendo:

- Armazenamento isolado por tenant (negócio)
- Controle de acesso granular
- Processamento de imagens
- Acesso público ou privado por arquivo
- Segurança integrada com o sistema de autenticação

## Estrutura de Buckets

O sistema organiza arquivos em buckets específicos:

### Buckets Principais

| Bucket | Descrição | Acesso |
|--------|-----------|--------|
| `avatars` | Imagens de perfil de usuários | Público |
| `business-logos` | Logos dos negócios | Público |
| `services` | Imagens de serviços | Público |
| `products` | Imagens de produtos | Público |
| `documents` | Documentos diversos | Privado |
| `clients` | Arquivos relacionados a clientes | Privado |
| `reports` | Relatórios gerados | Privado |
| `invoices` | Notas fiscais e comprovantes | Privado |
| `temp` | Arquivos temporários (validade: 24h) | Misto |

### Estrutura Interna de Pastas

Dentro de cada bucket, os arquivos são organizados seguindo esta estrutura:

```
<id_negocio>/                 # Pasta raiz por tenant
  ├── <categoria>/            # Categoria de arquivo
  │   ├── <id_entidade>/      # ID da entidade relacionada
  │   │   ├── <arquivo>       # Arquivo final
  │   │   └── ...
  │   └── ...
  └── ...
```

## Políticas de Acesso

As políticas RLS controlam o acesso aos arquivos:

### Exemplo de Políticas de Storage

```sql
-- Política para acesso público a logos de negócios
CREATE POLICY "Logos de negócios são públicas"
ON storage.objects FOR SELECT
USING (bucket_id = 'business-logos');

-- Política para permitir upload de arquivos somente ao próprio negócio
CREATE POLICY "Upload de arquivos pelo próprio negócio"
ON storage.objects FOR INSERT
WITH CHECK (
  -- Verificar se o caminho começa com o ID do negócio do usuário
  (storage.foldername(name))[1] IN (
    SELECT id_negocio::text FROM public.usuarios WHERE auth.uid() = id
  )
);

-- Política para acesso a arquivos privados
CREATE POLICY "Acesso a arquivos privados pelo próprio negócio"
ON storage.objects FOR SELECT
USING (
  bucket_id IN ('documents', 'clients', 'invoices', 'reports')
  AND
  (storage.foldername(name))[1] IN (
    SELECT id_negocio::text FROM public.usuarios WHERE auth.uid() = id
  )
);

-- Política para permitir exclusão de arquivos
CREATE POLICY "Exclusão de arquivos pelo próprio negócio"
ON storage.objects FOR DELETE
USING (
  (storage.foldername(name))[1] IN (
    SELECT id_negocio::text FROM public.usuarios 
    WHERE auth.uid() = id AND funcao IN ('admin', 'gerente')
  )
);
```

## Implementação no Frontend

### Hook para Upload de Arquivos

```tsx
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useTenant } from '@/hooks/useTenant';

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { currentTenant } = useTenant();
  
  const uploadFile = async ({
    file,
    bucket,
    category,
    entityId,
    isPublic = false,
    onSuccess,
    onError
  }) => {
    if (!currentTenant) {
      toast({
        title: 'Erro',
        description: 'Tenant não encontrado',
        variant: 'destructive'
      });
      onError?.('Tenant não encontrado');
      return null;
    }
    
    setIsUploading(true);
    
    try {
      // Construir caminho do arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${currentTenant.id}/${category}/${entityId}/${fileName}`;
      
      // Upload do arquivo
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: isPublic ? '3600' : '0',
          upsert: false
        });
      
      if (error) throw error;
      
      // Obter URL pública do arquivo se necessário
      let publicUrl = null;
      if (isPublic) {
        publicUrl = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path).data.publicUrl;
      }
      
      toast({
        title: 'Upload concluído',
        description: 'Arquivo enviado com sucesso',
        variant: 'success'
      });
      
      onSuccess?.({
        path: data.path,
        url: publicUrl,
        metadata: {
          fileName: file.name,
          contentType: file.type,
          size: file.size
        }
      });
      
      return {
        path: data.path,
        url: publicUrl
      };
    } catch (error) {
      console.error('Erro no upload:', error);
      
      toast({
        title: 'Erro no upload',
        description: error.message || 'Não foi possível enviar o arquivo',
        variant: 'destructive'
      });
      
      onError?.(error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  return {
    uploadFile,
    isUploading
  };
}
```

## Gerenciamento de Arquivos

### Rastreamento de Arquivos no Banco de Dados

Para facilitar o gerenciamento, o sistema rastreia metadados de arquivos no banco de dados:

```sql
-- Tabela para rastreamento de arquivos
CREATE TABLE public.arquivos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_negocio UUID NOT NULL REFERENCES public.negocios(id),
  bucket TEXT NOT NULL,
  caminho TEXT NOT NULL,
  nome_original TEXT NOT NULL,
  tipo_conteudo TEXT NOT NULL,
  tamanho BIGINT NOT NULL,
  entidade_tipo TEXT NOT NULL, -- 'cliente', 'servico', 'produto', etc.
  entidade_id UUID NOT NULL,
  publico BOOLEAN DEFAULT FALSE,
  url_publica TEXT,
  data_upload TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_expiracao TIMESTAMP WITH TIME ZONE,
  metadados JSONB DEFAULT '{}'::JSONB
);

-- Índices
CREATE INDEX idx_arquivos_id_negocio ON public.arquivos(id_negocio);
CREATE INDEX idx_arquivos_entidade ON public.arquivos(entidade_tipo, entidade_id);

-- Habilitar RLS
ALTER TABLE public.arquivos ENABLE ROW LEVEL SECURITY;

-- Política RLS para isolamento de dados por negócio
CREATE POLICY "Isolamento de arquivos por negócio"
ON public.arquivos
USING (
  id_negocio IN (
    SELECT id_negocio FROM public.usuarios WHERE auth.uid() = id
  )
);
```

### Limpeza de Arquivos Órfãos

Script para limpeza periódica de arquivos não referenciados:

```typescript
async function cleanOrphanedFiles() {
  try {
    // 1. Identificar arquivos não rastreados no Storage
    const { data: allStorageFiles } = await supabase.storage
      .from('documents')
      .list('', { limit: 1000 });
    
    // 2. Obter lista de caminhos rastreados no banco
    const { data: trackedFiles } = await supabase
      .from('arquivos')
      .select('caminho')
      .eq('bucket', 'documents');
    
    const trackedPaths = new Set(trackedFiles.map(file => file.caminho));
    
    // 3. Filtrar arquivos órfãos
    const orphanedFiles = allStorageFiles.filter(
      file => !trackedPaths.has(file.name)
    );
    
    // 4. Excluir arquivos órfãos
    for (const file of orphanedFiles) {
      await supabase.storage
        .from('documents')
        .remove([file.name]);
      
      console.log(`Arquivo órfão removido: ${file.name}`);
    }
    
    console.log(`Limpeza concluída. Removidos ${orphanedFiles.length} arquivos órfãos.`);
  } catch (error) {
    console.error('Erro na limpeza de arquivos:', error);
  }
}
```

## Processamento de Imagens

O Supabase Storage permite transformações básicas de imagens via URL:

### Transformações Disponíveis

- Redimensionamento
- Recorte
- Compressão
- Conversão de formato

### Exemplos de Transformação

```javascript
// Obter URL com transformações
function getOptimizedImageUrl(bucket, path, options = {}) {
  const { width, height, quality, format } = options;
  
  const baseUrl = supabase.storage
    .from(bucket)
    .getPublicUrl(path).data.publicUrl;
  
  let transformParams = [];
  
  if (width) transformParams.push(`width=${width}`);
  if (height) transformParams.push(`height=${height}`);
  if (quality) transformParams.push(`quality=${quality}`);
  if (format) transformParams.push(`format=${format}`);
  
  if (transformParams.length === 0) return baseUrl;
  
  return `${baseUrl}?${transformParams.join('&')}`;
}

// Uso:
const thumbnailUrl = getOptimizedImageUrl('products', 'path/to/image.jpg', {
  width: 200,
  height: 200,
  quality: 80,
  format: 'webp'
});
```

## Melhores Práticas

1. **Validação de Arquivos**: Sempre validar tipo e tamanho antes do upload
2. **Rastreamento Consistente**: Manter sincronizados os registros do banco e arquivos
3. **Expiração para Temporários**: Configurar TTL para arquivos temporários
4. **Organização por Tenant**: Sempre usar a estrutura `<id_negocio>/...`
5. **Otimização de Imagens**: Redimensionar e comprimir imagens antes de armazenar
6. **Backup Regular**: Implementar backup dos buckets críticos

## Exemplos de Implementação

### Componente de Upload de Imagem

```tsx
import { useState } from 'react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export function ImageUploader({ 
  bucket, 
  category, 
  entityId, 
  isPublic = true,
  onFileUploaded 
}) {
  const [preview, setPreview] = useState(null);
  const { uploadFile, isUploading } = useFileUpload();
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validar arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Arquivo inválido',
        description: 'Por favor, selecione uma imagem.',
        variant: 'destructive'
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Arquivo muito grande',
        description: 'O tamanho máximo permitido é 5MB.',
        variant: 'destructive'
      });
      return;
    }
    
    // Exibir preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
    
    // Fazer upload
    uploadFile({
      file,
      bucket,
      category,
      entityId,
      isPublic,
      onSuccess: (fileData) => {
        onFileUploaded?.(fileData);
      }
    });
  };
  
  return (
    <div className="image-uploader">
      <div className="preview-container">
        {preview && (
          <img 
            src={preview} 
            alt="Preview" 
            className="image-preview" 
          />
        )}
        
        {!preview && !isUploading && (
          <div className="upload-placeholder">
            <span>Selecione uma imagem</span>
          </div>
        )}
        
        {isUploading && (
          <div className="upload-loading">
            <Spinner size="md" />
            <span>Enviando...</span>
          </div>
        )}
      </div>
      
      <Button
        variant="outline"
        onClick={() => document.getElementById('file-input').click()}
        disabled={isUploading}
      >
        Selecionar Imagem
      </Button>
      
      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}
``` 