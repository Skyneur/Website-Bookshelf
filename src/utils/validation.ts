/**
 * Valide une adresse email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valide un numéro de téléphone français
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return phoneRegex.test(phone);
}

/**
 * Valide un code postal français
 */
export function isValidPostalCode(code: string): boolean {
  return /^\d{5}$/.test(code);
}

/**
 * Valide un ISBN (10 ou 13 chiffres)
 */
export function isValidISBN(isbn: string): boolean {
  // Supprimer tout ce qui n'est pas un chiffre ou 'X' (pour ISBN-10)
  const cleanISBN = isbn.replace(/[^\dX]/g, '');
  
  // ISBN-10
  if (cleanISBN.length === 10) {
    return validateISBN10(cleanISBN);
  }
  
  // ISBN-13
  if (cleanISBN.length === 13) {
    return validateISBN13(cleanISBN);
  }
  
  return false;
}

/**
 * Valide un ISBN-10
 */
function validateISBN10(isbn: string): boolean {
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(isbn[i]) * (10 - i);
  }
  
  // Le dernier caractère peut être 'X' qui vaut 10
  const lastChar = isbn[9];
  if (lastChar === 'X') {
    sum += 10;
  } else {
    sum += parseInt(lastChar);
  }
  
  return sum % 11 === 0;
}

/**
 * Valide un ISBN-13
 */
function validateISBN13(isbn: string): boolean {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(isbn[i]) * (i % 2 === 0 ? 1 : 3);
  }
  
  const check = (10 - (sum % 10)) % 10;
  return check === parseInt(isbn[12]);
}

/**
 * Génère un numéro d'adhérent unique
 */
export function generateMemberNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `ADH-${year}${month}-${random}`;
}