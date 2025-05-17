
// Function to format a phone number as (XX) XXXXX-XXXX
export const formatPhone = (value: string): string => {
  if (!value) return '';
  
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  
  // Format based on length
  if (digits.length <= 2) {
    return `(${digits}`;
  } else if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  } else if (digits.length <= 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  } else {
    // If more than 11 digits, truncate
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }
};

// Show success toast (mock for testing)
export const showSuccessToast = (message: string) => {
  console.log('Success:', message);
  // This would be replaced by an actual toast implementation
};

// Show error toast (mock for testing)
export const showErrorToast = (message = 'Ocorreu um erro. Tente novamente.') => {
  console.error('Error:', message);
  // This would be replaced by an actual toast implementation
};

// Mock save function for testing
export const mockSaveFunction = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};
