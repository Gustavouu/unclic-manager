import React from 'react';
import { useTranslation } from 'react-i18next';

export function ExampleI18n() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h2>{t('clientes.novo')}</h2>
      <button onClick={() => i18n.changeLanguage('en')}>EN</button>
      <button onClick={() => i18n.changeLanguage('pt')}>PT</button>
      <p>{t('erros.requiredField')}</p>
      <button>{t('ui.salvar')}</button>
      <button>{t('ui.cancelar')}</button>
    </div>
  );
} 