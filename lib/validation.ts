import { VALIDATION_RULES } from './config';

/**
 * Input validation utilities
 * Provides validation functions for user inputs
 */

export interface ValidationResult {
    valid: boolean;
    error?: string;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
    if (!email || email.trim() === '') {
        return { valid: false, error: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, error: 'Please enter a valid email address' };
    }

    return { valid: true };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationResult {
    if (!password || password.length < VALIDATION_RULES.MIN_PASSWORD_LENGTH) {
        return {
            valid: false,
            error: `Password must be at least ${VALIDATION_RULES.MIN_PASSWORD_LENGTH} characters long`
        };
    }

    if (password.length > VALIDATION_RULES.MAX_PASSWORD_LENGTH) {
        return {
            valid: false,
            error: `Password must be less than ${VALIDATION_RULES.MAX_PASSWORD_LENGTH} characters`
        };
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
        return { valid: false, error: 'Password must contain at least one number' };
    }

    // Check for at least one letter
    if (!/[a-zA-Z]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one letter' };
    }

    return { valid: true };
}

/**
 * Validate name
 */
export function validateName(name: string): ValidationResult {
    if (!name || name.trim() === '') {
        return { valid: false, error: 'Name is required' };
    }

    const trimmedName = name.trim();

    if (trimmedName.length < VALIDATION_RULES.MIN_NAME_LENGTH) {
        return {
            valid: false,
            error: `Name must be at least ${VALIDATION_RULES.MIN_NAME_LENGTH} characters`
        };
    }

    if (trimmedName.length > VALIDATION_RULES.MAX_NAME_LENGTH) {
        return {
            valid: false,
            error: `Name must be less than ${VALIDATION_RULES.MAX_NAME_LENGTH} characters`
        };
    }

    return { valid: true };
}

/**
 * Validate college name
 */
export function validateCollege(college: string): ValidationResult {
    if (!college || college.trim() === '') {
        return { valid: false, error: 'College name is required' };
    }

    const trimmedCollege = college.trim();

    if (trimmedCollege.length < VALIDATION_RULES.MIN_COLLEGE_LENGTH) {
        return {
            valid: false,
            error: `College name must be at least ${VALIDATION_RULES.MIN_COLLEGE_LENGTH} characters`
        };
    }

    if (trimmedCollege.length > VALIDATION_RULES.MAX_COLLEGE_LENGTH) {
        return {
            valid: false,
            error: `College name must be less than ${VALIDATION_RULES.MAX_COLLEGE_LENGTH} characters`
        };
    }

    return { valid: true };
}

/**
 * Validate team name
 */
export function validateTeamName(teamName: string): ValidationResult {
    if (!teamName || teamName.trim() === '') {
        return { valid: false, error: 'Team name is required' };
    }

    const trimmedName = teamName.trim();

    if (trimmedName.length < VALIDATION_RULES.MIN_TEAM_NAME_LENGTH) {
        return {
            valid: false,
            error: `Team name must be at least ${VALIDATION_RULES.MIN_TEAM_NAME_LENGTH} characters`
        };
    }

    if (trimmedName.length > VALIDATION_RULES.MAX_TEAM_NAME_LENGTH) {
        return {
            valid: false,
            error: `Team name must be less than ${VALIDATION_RULES.MAX_TEAM_NAME_LENGTH} characters`
        };
    }

    return { valid: true };
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
    if (!input) return '';

    return input
        .trim()
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, ''); // Remove event handlers
}

/**
 * Validate and sanitize text input
 */
export function validateAndSanitize(input: string, minLength: number, maxLength: number, fieldName: string): ValidationResult {
    if (!input || input.trim() === '') {
        return { valid: false, error: `${fieldName} is required` };
    }

    const sanitized = sanitizeInput(input);

    if (sanitized.length < minLength) {
        return { valid: false, error: `${fieldName} must be at least ${minLength} characters` };
    }

    if (sanitized.length > maxLength) {
        return { valid: false, error: `${fieldName} must be less than ${maxLength} characters` };
    }

    return { valid: true };
}
