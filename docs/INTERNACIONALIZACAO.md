# Internacionalização (i18n) – UnCliC Manager

## Estrutura de Arquivos

- Traduções em `/src/locales/{pt,en}/translation.json`.
- Chaves organizadas por domínio (ex: `clientes`, `agendamentos`, `erros`, `ui`).
- Exemplo de arquivo:
  ```json
  {
    "clientes": {
      "novo": "Novo Cliente",
      "editar": "Editar Cliente"
    },
    "erros": {
      "requiredField": "Campo obrigatório"
    }
  }
  ```

---

## Uso do i18next

- Configuração em `/src/i18n.ts`.
- Uso do hook `useTranslation()` nos componentes:
  ```tsx
  import { useTranslation } from 'react-i18next';
  const { t, i18n } = useTranslation();
  <Button>{t('clientes.novo')}</Button>
  ```
- Troca de idioma:
  ```ts
  i18n.changeLanguage('en');
  ```

---

## Formatação de Datas e Moedas

- Uso de `Intl.DateTimeFormat` e `Intl.NumberFormat`:
  ```ts
  const dataFormatada = new Intl.DateTimeFormat(i18n.language, { dateStyle: 'short' }).format(new Date());
  const valorFormatado = new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'BRL' }).format(123.45);
  ```

---

## Edge Cases

- Chaves faltantes: fallback para idioma padrão (PT).
- Campos dinâmicos: usar interpolação (`t('msg', { nome: 'João' })`).
- Pluralização: usar recursos do i18next (`t('clientes', { count: 2 })`).
- Mensagens de erro e feedback sempre internacionalizadas.

---

## Recomendações para Novos Idiomas

- Copiar estrutura de `pt/translation.json` para novo idioma.
- Validar traduções com nativos ou especialistas.
- Testar interface completa no novo idioma (datas, moedas, textos longos).
- Atualizar documentação e exemplos.

---

**Última atualização:** [DATA_ATUALIZACAO] 