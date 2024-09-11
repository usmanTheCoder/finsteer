import { z } from 'zod';

export const emailSchema = z
  .string()
  .email('Invalid email address')
  .refine((val) => val.trim().length > 0, {
    message: 'Email is required',
  });

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(100, 'Password must be at most 100 characters long')
  .refine(
    (val) => /[A-Z]/.test(val),
    'Password must contain at least one uppercase letter'
  )
  .refine(
    (val) => /[a-z]/.test(val),
    'Password must contain at least one lowercase letter'
  )
  .refine(
    (val) => /\d/.test(val),
    'Password must contain at least one digit'
  )
  .refine(
    (val) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
    'Password must contain at least one special character'
  );

export const accountNameSchema = z
  .string()
  .min(3, 'Account name must be at least 3 characters long')
  .max(50, 'Account name must be at most 50 characters long')
  .refine(
    (val) => /^[a-zA-Z0-9 ]+$/.test(val),
    'Account name must contain only letters, numbers, and spaces'
  );

export const transactionDescriptionSchema = z
  .string()
  .min(3, 'Description must be at least 3 characters long')
  .max(100, 'Description must be at most 100 characters long');

export const transactionAmountSchema = z
  .number()
  .positive('Amount must be a positive number')
  .refine(
    (val) => val % 0.01 === 0,
    'Amount must be a multiple of 0.01'
  );

export const dateSchema = z.date();

export const currencySchema = z.union([
  z.literal('USD'),
  z.literal('EUR'),
  z.literal('GBP'),
  z.literal('JPY'),
  z.literal('AUD'),
  z.literal('CAD'),
  z.literal('CHF'),
  z.literal('CNY'),
  z.literal('HKD'),
  z.literal('NZD'),
  z.literal('SEK'),
  z.literal('KRW'),
  z.literal('SGD'),
  z.literal('NOK'),
  z.literal('MXN'),
  z.literal('INR'),
  z.literal('RUB'),
  z.literal('ZAR'),
  z.literal('TRY'),
  z.literal('BRL'),
  z.literal('TWD'),
  z.literal('DKK'),
  z.literal('PLN'),
  z.literal('THB'),
  z.literal('IDR'),
  z.literal('HUF'),
  z.literal('CZK'),
  z.literal('ILS'),
  z.literal('CLP'),
  z.literal('PHP'),
  z.literal('AED'),
  z.literal('QAR'),
  z.literal('SAR'),
]);

export type Email = z.infer<typeof emailSchema>;
export type Password = z.infer<typeof passwordSchema>;
export type AccountName = z.infer<typeof accountNameSchema>;
export type TransactionDescription = z.infer<typeof transactionDescriptionSchema>;
export type TransactionAmount = z.infer<typeof transactionAmountSchema>;
export type Date = z.infer<typeof dateSchema>;
export type Currency = z.infer<typeof currencySchema>;