/**
 * Gera opções de horário para agendamentos com intervalos de 30 minutos
 * @param startHour Hora de início (padrão: 8)
 * @param endHour Hora de término (padrão: 20)
 * @param intervalMinutes Intervalo em minutos (padrão: 30)
 * @returns Array de strings no formato "HH:MM"
 */
export function generateTimeOptions(
  startHour: number = 8,
  endHour: number = 20,
  intervalMinutes: number = 30
): string[] {
  const timeOptions: string[] = [];
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      // Formata a hora com dois dígitos
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      
      timeOptions.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  
  return timeOptions;
} 