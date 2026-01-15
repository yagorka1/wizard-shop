export const ERROR_MESSAGES: Record<string, (error?: any) => string> = {
  required: () => 'Поле обязательно',
  minlength: (e) => `Минимум ${e.requiredLength} символов`,
  maxlength: (e) => `Максимум ${e.requiredLength} символов`,
  email: () => 'Некорректный email',
  pattern: () => 'Неверный формат',
  min: (e) => `Минимум ${e.min}`,
  max: (e) => `Максимум ${e.max}`,
  dateRange: () => 'Дата не может быть раньше даты заказа',
};