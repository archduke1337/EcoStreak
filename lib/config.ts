/**
 * Centralized configuration constants for EcoStreak
 * All magic numbers and configuration values should be defined here
 */

export const GAME_CONFIG = {
    // Points and Leveling
    POINTS_PER_LEVEL: 100,
    POINTS_FOR_CERTIFICATE: 1000,
    QUIZ_POINTS_PER_MODULE: 100,

    // Virtual Forest
    POINTS_PER_TREE: 50,
    MAX_TREES: 20,

    // Challenges
    MIN_CHALLENGE_POINTS: 20,
    MAX_CHALLENGE_POINTS: 40,

    // Streaks
    MIN_STREAK_FOR_BADGE: 3,
    WEEK_STREAK: 7,
    TWO_WEEK_STREAK: 14,
    MONTH_STREAK: 30,
    TWO_MONTH_STREAK: 60,
    HUNDRED_DAY_STREAK: 100,

    // Modules
    TOTAL_MODULES: 8,
    QUESTIONS_PER_QUIZ: 10,

    // Mini-games
    MINI_GAME_BASE_POINTS: 20,
    MINI_GAME_MAX_POINTS: 50,

    // Badges
    TOTAL_BADGES: 24,

    // Teams
    TEAM_CODE_LENGTH: 6,
    MAX_TEAM_SIZE: 20,
} as const;

export const BADGE_REQUIREMENTS = {
    // Points-based
    BEGINNER: 50,
    ECO_WARRIOR: 100,
    RISING_STAR: 250,
    CLIMATE_CHAMPION: 500,
    SUSTAINABILITY_HERO: 1000,
    PLANET_PROTECTOR: 2000,
    EXPERT: 3500,
    MASTER: 5000,
    LEGEND: 10000,

    // Module-based
    FIRST_STEPS: 1,
    KNOWLEDGE_SEEKER: 3,
    SCHOLAR: 5,
    MASTER_LEARNER: 8,

    // Challenge-based
    CHALLENGE_MASTER: 10,
} as const;

export const UI_CONFIG = {
    // Animation durations (ms)
    ANIMATION_FAST: 200,
    ANIMATION_NORMAL: 300,
    ANIMATION_SLOW: 500,
    CONFETTI_DURATION: 3000,

    // Pagination
    ITEMS_PER_PAGE: 20,
    LEADERBOARD_TOP_COUNT: 100,

    // Debounce delays (ms)
    SEARCH_DEBOUNCE: 300,
    INPUT_DEBOUNCE: 500,
} as const;

export const API_CONFIG = {
    // Rate limiting (requests per minute)
    MAX_QUIZ_SUBMISSIONS_PER_HOUR: 10,
    MAX_PROFILE_UPDATES_PER_HOUR: 5,
    MAX_TEAM_CREATIONS_PER_DAY: 3,

    // Retry configuration
    MAX_RETRIES: 3,
    RETRY_DELAY_MS: 1000,
} as const;

export const VALIDATION_RULES = {
    // Password
    MIN_PASSWORD_LENGTH: 8,
    MAX_PASSWORD_LENGTH: 128,

    // Name
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 50,

    // College
    MIN_COLLEGE_LENGTH: 3,
    MAX_COLLEGE_LENGTH: 100,

    // Team
    MIN_TEAM_NAME_LENGTH: 3,
    MAX_TEAM_NAME_LENGTH: 30,
} as const;

export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    SESSION_EXPIRED: 'Your session has expired. Please login again.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

export const SUCCESS_MESSAGES = {
    PROFILE_UPDATED: 'Profile updated successfully!',
    QUIZ_COMPLETED: 'Quiz completed! Points added to your account.',
    CHALLENGE_COMPLETED: 'Challenge completed! Keep up the good work!',
    TEAM_CREATED: 'Team created successfully!',
    TEAM_JOINED: 'Successfully joined the team!',
} as const;
