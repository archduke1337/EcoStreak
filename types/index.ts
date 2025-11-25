export interface User {
    $id: string;
    name: string;
    email: string;
    college: string;
    points: number;
    level: number;
    badges: string[];
    streak: number;
    lastActiveDate: string;
    role: 'student' | 'admin';
    teamId?: string;
    completedTasks?: string; // JSON string of CompletedTask[]
    $createdAt: string;
}

export interface Team {
    $id: string;
    teamName: string;
    teamCode: string;
    leaderId: string;
    members: string[];
    totalPoints: number;
    $createdAt: string;
}

export interface DailyChallenge {
    $id: string;
    date: string;
    title: string;
    description: string;
    points: number;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string; // Badge background color
    requirement: number;
    type: 'points' | 'streak' | 'modules' | 'special';
}

export interface Module {
    slug: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    content: ModuleContent;
    quiz: QuizQuestion[];
    miniGame?: 'waste-sorting' | 'carbon-calculator';
}

export interface ModuleContent {
    introduction: string;
    sections: {
        title: string;
        content: string;
    }[];
    facts: string[];
    actionItems: string[];
}

export interface QuizQuestion {
    id: string;
    question: string;
    type: 'mcq' | 'true-false';
    options?: string[];
    correctAnswer: string | number;
    explanation: string;
    points: number;
}

export interface LeaderboardEntry {
    rank: number;
    userId: string;
    name: string;
    college: string;
    points: number;
    level: number;
    badges: number;
}

export interface WasteItem {
    id: string;
    name: string;
    category: 'wet' | 'dry' | 'hazardous' | 'recyclable';
    image: string;
}
