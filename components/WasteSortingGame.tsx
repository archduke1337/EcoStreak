'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardBody, Button } from '@nextui-org/react';
import { WasteItem } from '@/types';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const wasteItems: WasteItem[] = [
    { id: '1', name: 'Banana Peel', category: 'wet', image: '🍌' },
    { id: '2', name: 'Plastic Bottle', category: 'recyclable', image: '🍾' },
    { id: '3', name: 'Battery', category: 'hazardous', image: '🔋' },
    { id: '4', name: 'Newspaper', category: 'dry', image: '📰' },
    { id: '5', name: 'Food Scraps', category: 'wet', image: '🥗' },
    { id: '6', name: 'Glass Jar', category: 'recyclable', image: '🫙' },
    { id: '7', name: 'Medicine', category: 'hazardous', image: '💊' },
    { id: '8', name: 'Cardboard', category: 'dry', image: '📦' },
];

export default function WasteSortingGame({ onComplete }: { onComplete: (points: number) => void }) {
    const [items, setItems] = useState(wasteItems);
    const [bins, setBins] = useState<Record<string, WasteItem[]>>({
        wet: [],
        dry: [],
        hazardous: [],
        recyclable: [],
    });
    const [gameComplete, setGameComplete] = useState(false);

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        if (!destination) return;

        // Moving from items list to bin
        if (source.droppableId === 'items' && destination.droppableId !== 'items') {
            const item = items[source.index];
            const newItems = Array.from(items);
            newItems.splice(source.index, 1);

            const newBins = { ...bins };
            newBins[destination.droppableId] = [...newBins[destination.droppableId], item];

            setItems(newItems);
            setBins(newBins);

            // Check if correct
            if (destination.droppableId === item.category) {
                toast.success('Correct! ♻️');
            } else {
                toast.error('Wrong bin! Try again.');
            }
        }
    };

    const handleSubmit = () => {
        let correctCount = 0;
        let totalCount = 0;

        Object.entries(bins).forEach(([binType, binItems]) => {
            binItems.forEach((item) => {
                totalCount++;
                if (item.category === binType) {
                    correctCount++;
                }
            });
        });

        const score = correctCount;
        const points = score * 10;

        setGameComplete(true);
        toast.success(`You sorted ${correctCount}/${totalCount} items correctly! +${points} points`);
        setTimeout(() => {
            onComplete(points);
        }, 2000);
    };

    if (gameComplete) {
        return (
            <Card>
                <CardBody className="text-center p-12">
                    <div className="text-6xl mb-4">♻️</div>
                    <h3 className="text-2xl font-bold mb-2">Great Job!</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        You&apos;ve completed the waste sorting challenge!
                    </p>
                </CardBody>
            </Card>
        );
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="space-y-6">
                {/* Items to Sort */}
                <Card>
                    <CardBody>
                        <h3 className="text-xl font-bold mb-4">Items to Sort</h3>
                        <Droppable droppableId="items" direction="horizontal">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="flex flex-wrap gap-3 min-h-[80px]"
                                >
                                    {items.map((item, index) => (
                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`p-3 bg-white dark:bg-gray-700 rounded-lg shadow cursor-move ${snapshot.isDragging ? 'opacity-50' : ''
                                                        }`}
                                                >
                                                    <div className="text-3xl">{item.image}</div>
                                                    <p className="text-xs text-center mt-1">{item.name}</p>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </CardBody>
                </Card>

                {/* Bins */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { id: 'wet', name: 'Wet Waste', color: 'bg-green-100 dark:bg-green-900', icon: '🌿' },
                        { id: 'dry', name: 'Dry Waste', color: 'bg-blue-100 dark:bg-blue-900', icon: '📄' },
                        { id: 'hazardous', name: 'Hazardous', color: 'bg-red-100 dark:bg-red-900', icon: '⚠️' },
                        { id: 'recyclable', name: 'Recyclable', color: 'bg-yellow-100 dark:bg-yellow-900', icon: '♻️' },
                    ].map((bin) => (
                        <Card key={bin.id} className={bin.color}>
                            <CardBody>
                                <h4 className="font-semibold text-center mb-2">
                                    {bin.icon} {bin.name}
                                </h4>
                                <Droppable droppableId={bin.id}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className="min-h-[120px] flex flex-col gap-2"
                                        >
                                            {bins[bin.id].map((item, index) => (
                                                <div key={item.id} className="p-2 bg-white dark:bg-gray-700 rounded text-center">
                                                    <div className="text-2xl">{item.image}</div>
                                                    <p className="text-xs">{item.name}</p>
                                                </div>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </CardBody>
                        </Card>
                    ))}
                </div>

                {items.length === 0 && (
                    <Button color="success" size="lg" onPress={handleSubmit} className="w-full">
                        Submit & Check Answers
                    </Button>
                )}
            </div>
        </DragDropContext>
    );
}
