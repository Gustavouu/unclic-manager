
/**
 * Validates if a string is a valid UUID
 */
export const isValidUUID = (id: string | undefined): boolean => {
  if (!id) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

/**
 * Default UUID to use when a valid UUID is required but not provided
 */
export const DEFAULT_UUID = "00000000-0000-4000-a000-000000000001";
