'use client';

import { useState } from 'react';
import { QuizQuestion } from '@/types';
import { Button, Card, CardBody, Radio, RadioGroup, Progress } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Confetti from 'react-confetti';

interface QuizProps {
    questions: QuizQuestion[];
    onComplete: (score: number, totalPoints: number) => void;
}

export default function Quiz({ questions, onComplete }: QuizProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');
    const [score, setScore] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [quizComplete, setQuizComplete] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    const handleSubmit = () => {
        if (!selectedAnswer) {
            toast.error('Please select an answer');
            return;
        }

        const correct =
            question.type === 'mcq'
                ? parseInt(selectedAnswer) === question.correctAnswer
                : selectedAnswer === question.correctAnswer;

        setIsCorrect(correct);
        setShowExplanation(true);

        if (correct) {
            setScore(score + 1);
            setTotalPoints(totalPoints + question.points);
            toast.success(`Correct! +${question.points} points 🎉`);
        } else {
            toast.error('Incorrect. Read the explanation below.');
        }
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer('');
            setShowExplanation(false);
            setIsCorrect(false);
        } else {
            setQuizComplete(true);
            setShowConfetti(true);
            setTimeout(() => {
                onComplete(score + (isCorrect ? 1 : 0), totalPoints);
            }, 3000);
        }
    };

    if (quizComplete) {
        return (
            <>
                {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
                <Card className="max-w-2xl mx-auto">
                    <CardBody className="text-center p-12">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                        >
                            <div className="text-8xl mb-4">🎉</div>
                            <h2 className="text-4xl font-bold mb-4">Quiz Complete!</h2>
                            <p className="text-2xl mb-2">
                                Score: {score + (isCorrect ? 1 : 0)}/{questions.length}
                            </p>
                            <p className="text-xl text-green-600 font-semibold">
                                +{totalPoints} points earned!
                            </p>
                        </motion.div>
                    </CardBody>
                </Card>
            </>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Progress value={progress} className="mb-6" color="success" />

            <Card>
                <CardBody className="p-8">
                    <div className="mb-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Question {currentQuestion + 1} of {questions.length}
                        </p>
                        <h3 className="text-2xl font-bold mb-6">{question.question}</h3>

                        {question.type === 'mcq' && question.options ? (
                            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                                {question.options.map((option, index) => (
                                    <Radio key={index} value={index.toString()} className="mb-2">
                                        {option}
                                    </Radio>
                                ))}
                            </RadioGroup>
                        ) : (
                            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                                <Radio value="true" className="mb-2">
                                    True
                                </Radio>
                                <Radio value="false">
                                    False
                                </Radio>
                            </RadioGroup>
                        )}
                    </div>

                    {showExplanation && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-lg mb-4 ${isCorrect
                                ? 'bg-green-100 dark:bg-green-900 border border-green-500'
                                : 'bg-red-100 dark:bg-red-900 border border-red-500'
                                }`}
                        >
                            <p className="font-semibold mb-2">
                                {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
                            </p>
                            <p className="text-sm">{question.explanation}</p>
                        </motion.div>
                    )}

                    <div className="flex gap-4">
                        {!showExplanation ? (
                            <Button color="primary" onPress={handleSubmit} className="flex-1">
                                Submit Answer
                            </Button>
                        ) : (
                            <Button color="success" onPress={handleNext} className="flex-1">
                                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                            </Button>
                        )}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
