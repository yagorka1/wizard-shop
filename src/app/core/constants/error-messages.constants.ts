interface ValidationError {
  [key: string]: unknown;
}

interface ErrorMessage {
  key: string;
  params?: Record<string, unknown>;
}

export const ERROR_MESSAGES: Record<string, (error: ValidationError) => ErrorMessage> = {
  required: () => ({ key: 'errors.required' }),
  minlength: (e) => ({ key: 'errors.minlength', params: { requiredLength: e['requiredLength'] } }),
  maxlength: (e) => ({ key: 'errors.maxlength', params: { requiredLength: e['requiredLength'] } }),
  email: () => ({ key: 'errors.email' }),
  pattern: () => ({ key: 'errors.pattern' }),
  min: (e) => ({ key: 'errors.min', params: { min: e['min'] } }),
  max: (e) => ({ key: 'errors.max', params: { max: e['max'] } }),
  dateRange: () => ({ key: 'errors.dateRange' }),
};
