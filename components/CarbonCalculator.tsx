'use client';

import { useState } from 'react';
import { Card, CardBody, Button, Input, Select, SelectItem } from '@nextui-org/react';
import { toast } from 'sonner';

export default function CarbonCalculator({ onComplete }: { onComplete: (points: number) => void }) {
    const [transport, setTransport] = useState('bike');
    const [distance, setDistance] = useState('10');
    const [electricity, setElectricity] = useState('200');
    const [diet, setDiet] = useState('vegetarian');
    const [calculated, setCalculated] = useState(false);
    const [footprint, setFootprint] = useState(0);

    const calculateFootprint = () => {
        // Simplified carbon footprint calculation (kg CO2 per month)
        let total = 0;

        // Transport (km per day * 30 days)
        const distanceNum = parseInt(distance) * 30;
        const transportFactors: Record<string, number> = {
            bike: 0,
            'public-transport': 0.05,
            'two-wheeler': 0.08,
            car: 0.12,
        };
        total += distanceNum * (transportFactors[transport] || 0);

        // Electricity (kWh per month)
        total += parseInt(electricity) * 0.85; // 0.85 kg CO2 per kWh in India

        // Diet (kg CO2 per month)
        const dietFactors: Record<string, number> = {
            vegan: 50,
            vegetarian: 80,
            'mixed-low-meat': 120,
            'meat-heavy': 200,
        };
        total += dietFactors[diet] || 80;

        setFootprint(Math.round(total));
        setCalculated(true);

        // Award points based on how low the footprint is
        let points = 0;
        if (total < 100) points = 50;
        else if (total < 200) points = 40;
        else if (total < 300) points = 30;
        else points = 20;

        toast.success(`Your carbon footprint: ${Math.round(total)} kg CO2/month. +${points} points!`);
        setTimeout(() => {
            onComplete(points);
        }, 3000);
    };

    return (
        <Card>
            <CardBody className="p-8">
                <h3 className="text-2xl font-bold mb-6">🌍 Carbon Footprint Calculator</h3>

                {!calculated ? (
                    <div className="space-y-6">
                        <Select
                            label="Primary Mode of Transport"
                            selectedKeys={[transport]}
                            onChange={(e) => setTransport(e.target.value)}
                        >
                            <SelectItem key="bike" value="bike">
                                🚴 Bicycle/Walking (Zero Emissions)
                            </SelectItem>
                            <SelectItem key="public-transport" value="public-transport">
                                🚌 Public Transport
                            </SelectItem>
                            <SelectItem key="two-wheeler" value="two-wheeler">
                                🛵 Two-Wheeler
                            </SelectItem>
                            <SelectItem key="car" value="car">
                                🚗 Car
                            </SelectItem>
                        </Select>

                        <Input
                            type="number"
                            label="Daily Travel Distance (km)"
                            value={distance}
                            onChange={(e) => setDistance(e.target.value)}
                            min="0"
                        />

                        <Input
                            type="number"
                            label="Monthly Electricity Consumption (kWh)"
                            value={electricity}
                            onChange={(e) => setElectricity(e.target.value)}
                            min="0"
                        />

                        <Select
                            label="Dietary Preference"
                            selectedKeys={[diet]}
                            onChange={(e) => setDiet(e.target.value)}
                        >
                            <SelectItem key="vegan" value="vegan">
                                🥗 Vegan
                            </SelectItem>
                            <SelectItem key="vegetarian" value="vegetarian">
                                🥘 Vegetarian
                            </SelectItem>
                            <SelectItem key="mixed-low-meat" value="mixed-low-meat">
                                🍽️ Mixed (Low Meat)
                            </SelectItem>
                            <SelectItem key="meat-heavy" value="meat-heavy">
                                🍖 Meat Heavy
                            </SelectItem>
                        </Select>

                        <Button color="primary" size="lg" onPress={calculateFootprint} className="w-full">
                            Calculate My Footprint
                        </Button>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="text-6xl mb-4">
                            {footprint < 150 ? '🌱' : footprint < 250 ? '🌿' : '🌳'}
                        </div>
                        <h4 className="text-3xl font-bold mb-2">{footprint} kg CO2/month</h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {footprint < 150
                                ? 'Excellent! You have a low carbon footprint 🌟'
                                : footprint < 250
                                    ? 'Good! But there\'s room for improvement 💪'
                                    : 'Consider reducing your carbon footprint 🌍'}
                        </p>
                        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
                            <p className="font-semibold mb-2">Tips to Reduce:</p>
                            <ul className="text-sm text-left space-y-1">
                                <li>• Use public transport or cycling more often</li>
                                <li>• Switch to LED bulbs and energy-efficient appliances</li>
                                <li>• Reduce meat consumption</li>
                                <li>• Use renewable energy sources</li>
                            </ul>
                        </div>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
