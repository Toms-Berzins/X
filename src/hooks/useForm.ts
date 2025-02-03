import { useState, useCallback } from 'react';

interface ValidationRules {
  [key: string]: {
    required?: boolean;
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    validate?: (value: any) => boolean | string;
  };
}

interface Errors {
  [key: string]: string;
}

export const useForm = <T extends { [key: string]: any }>(
  initialValues: T,
  validationRules: ValidationRules = {}
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = useCallback(
    (name: string, value: any) => {
      const rules = validationRules[name];
      if (!rules) return '';

      if (rules.required && !value) {
        return 'This field is required';
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        return 'Invalid format';
      }

      if (rules.minLength && value.length < rules.minLength) {
        return `Minimum length is ${rules.minLength} characters`;
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        return `Maximum length is ${rules.maxLength} characters`;
      }

      if (rules.validate) {
        const result = rules.validate(value);
        if (typeof result === 'string') return result;
        if (!result) return 'Invalid value';
      }

      return '';
    },
    [validationRules]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setValues(prev => ({ ...prev, [name]: value }));
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    },
    [validateField]
  );

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: Errors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(key => {
      const error = validateField(key, values[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validateField, values, validationRules]);

  const handleSubmit = useCallback(
    (onSubmit: (values: T) => void) => (e: React.FormEvent) => {
      e.preventDefault();
      const isValid = validateForm();
      if (isValid) {
        onSubmit(values);
      }
    },
    [validateForm, values]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
};
