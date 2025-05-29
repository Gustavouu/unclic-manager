
// Temporary file to handle i18n errors - this should be properly configured later
export const i18n = {
  t: (key: string) => key,
  changeLanguage: (lang: string) => Promise.resolve(),
};

export default i18n;
