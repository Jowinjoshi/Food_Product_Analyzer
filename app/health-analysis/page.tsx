'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Heart, Brain, TrendingUp, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const formSchema = z.object({
  Ages: z.number().min(1).max(120),
  Gender: z.string(),
  Height: z.number().min(50).max(300),
  Weight: z.number().min(20).max(500),
  'Activity Level': z.string(),
  'Dietary Preference': z.string(),
  'Daily Calorie Target': z.number().min(800).max(5000),
  Protein: z.number().min(0).max(500),
  Sugar: z.number().min(0).max(500),
  Sodium: z.number().min(0).max(100),
  Calories: z.number().min(800).max(5000),
  Carbohydrates: z.number().min(0).max(1000),
  Fiber: z.number().min(0).max(150),
  Fat: z.number().min(0).max(300),
});

type FormData = z.infer<typeof formSchema>;

interface PredictionResult {
  predicted_disease: string;
  confidence: number;
  risk_level: string;
  all_probabilities: Record<string, number>;
  recommendations: string[];
}

const defaultMealData = {
  'Breakfast Suggestion': 'Oatmeal with fruit and nuts',
  'Breakfast Calories': 350,
  'Breakfast Protein': 12,
  'Breakfast Carbohydrates': 55,
  'Breakfast Fats': 8,
  'Lunch Suggestion': 'Grilled chicken with quinoa and vegetables',
  'Lunch Calories': 500,
  'Lunch Protein': 35,
  'Lunch Carbohydrates': 45,
  'Lunch Fats': 15,
  'Dinner Suggestion': 'Salmon with roasted vegetables',
  'Dinner Calories': 600,
  'Dinner Protein.1': 40,
  'Dinner Carbohydrates.1': 30,
  'Dinner Fats': 25,
  'Snack Suggestion': 'Greek yogurt with berries',
  'Snacks Calories': 150,
  'Snacks Protein': 15,
  'Snacks Carbohydrates': 20,
  'Snacks Fats': 3,
};

export default function HealthAnalysisPage() {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Ages: 30,
      Gender: 'Male',
      Height: 175,
      Weight: 75,
      'Activity Level': 'Moderately Active',
      'Dietary Preference': 'Omnivore',
      'Daily Calorie Target': 2200,
      Protein: 120,
      Sugar: 80,
      Sodium: 25,
      Calories: 2200,
      Carbohydrates: 275,
      Fiber: 30,
      Fat: 75,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const requestData = {
        ...data,
        ...defaultMealData,
      };

      const response = await fetch('http://127.0.0.1:5000/food/predict-disease', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: PredictionResult = await response.json();
      setPrediction(result);
      toast.success('Health analysis completed successfully!');
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error('Failed to analyze health data. Make sure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen pt-20 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-12 w-12 text-blue-600 mr-4" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              AI Health Analysis
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Get personalized health risk predictions based on your lifestyle and nutrition
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Enter your details for accurate health risk analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Demographics */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Demographics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="Ages"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Age</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="Gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Male">Male</SelectItem>
                                  <SelectItem value="Female">Female</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="Height"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Height (cm)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="Weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Weight (kg)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Lifestyle */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Lifestyle</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <FormField
                          control={form.control}
                          name="Activity Level"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Activity Level</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Sedentary">Sedentary</SelectItem>
                                  <SelectItem value="Lightly Active">Lightly Active</SelectItem>
                                  <SelectItem value="Moderately Active">Moderately Active</SelectItem>
                                  <SelectItem value="Very Active">Very Active</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="Dietary Preference"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dietary Preference</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Omnivore">Omnivore</SelectItem>
                                  <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                                  <SelectItem value="Vegan">Vegan</SelectItem>
                                  <SelectItem value="Keto">Keto</SelectItem>
                                  <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Nutrition */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Daily Nutrition</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="Daily Calorie Target"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Calorie Target</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="Calories"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Actual Calories</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="Protein"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Protein (g)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="Carbohydrates"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Carbohydrates (g)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="Fat"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fat (g)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="Fiber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fiber (g)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="Sugar"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sugar (g)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="Sodium"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sodium (g)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.1"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Analyze Health Risk
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-blue-600" />
                  AI Analysis Results
                </CardTitle>
                <CardDescription>
                  Your personalized health risk assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!prediction && !isLoading && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Submit your information to get your health analysis</p>
                  </div>
                )}

                {isLoading && (
                  <div className="text-center py-12">
                    <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin text-blue-600" />
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                      Analyzing your health data...
                    </p>
                  </div>
                )}

                {prediction && (
                  <div className="space-y-6">
                    {/* Primary Prediction */}
                    <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-lg">
                      <div className="mb-4">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {prediction.predicted_disease}
                        </h3>
                        <Badge
                          variant={getRiskBadgeVariant(prediction.risk_level)}
                          className="text-sm px-3 py-1"
                        >
                          {prediction.risk_level} Risk
                        </Badge>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Confidence Level</span>
                          <span className="text-sm font-medium">
                            {Math.round(prediction.confidence * 100)}%
                          </span>
                        </div>
                        <Progress
                          value={prediction.confidence * 100}
                          className="h-3"
                        />
                      </div>
                    </div>

                    {/* All Probabilities */}
                    {prediction.all_probabilities && (
                      <div>
                        <h4 className="text-lg font-semibold mb-3">Risk Distribution</h4>
                        <div className="space-y-2">
                          {Object.entries(prediction.all_probabilities)
                            .sort(([,a], [,b]) => b - a)
                            .map(([disease, probability]) => (
                              <div key={disease} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                  {disease}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${getRiskColor('medium')}`}
                                      style={{ width: `${probability * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium w-12">
                                    {Math.round(probability * 100)}%
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {prediction.recommendations && prediction.recommendations.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold mb-3 flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                          Recommendations
                        </h4>
                        <div className="space-y-2">
                          {prediction.recommendations.map((rec, index) => (
                            <Alert key={index} className="border-green-200 dark:border-green-800">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription className="text-sm">
                                {rec}
                              </AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Additional Info */}
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Disclaimer:</strong> This analysis is for informational purposes only and should not replace professional medical advice. Consult with a healthcare provider for personalized medical guidance.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}