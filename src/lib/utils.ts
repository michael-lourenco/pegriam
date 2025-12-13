import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utilitário para combinar classes Tailwind
 * Usado em todos os componentes para garantir consistência
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

