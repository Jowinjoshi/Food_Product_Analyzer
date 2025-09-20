'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Activity, Heart, TrendingUp, Users, Brain, Apple, Target, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const nutritionData = [
  { name: 'Protein', value: 120, target: 150, unit: 'g' },
  { name: 'Carbs', value: 220, target: 250, unit: 'g' },
  { name: 'Fat', value: 65, target: 75, unit: 'g' },
  { name: 'Fiber', value: 28, target: 35, unit: 'g' },
];

const riskDistribution = [
  { name: 'Low Risk', value: 65, color: '#10b981' },
  { name: 'Medium Risk', value: 25, color: '#f59e0b' },
  { name: 'High Risk', value: 10, color: '#ef4444' },
];

const weeklyProgress = [
  { day: 'Mon', calories: 2100, target: 2200 },
  { day: 'Tue', calories: 2300, target: 2200 },
  { day: 'Wed', calories: 2050, target: 2200 },
  { day: 'Thu', calories: 2400, target: 2200 },
  { day: 'Fri', calories: 2150, target: 2200 },
  { day: 'Sat', calories: 2500, target: 2200 },
  { day: 'Sun', calories: 2000, target: 2200 },
];

const healthMetrics = [
  { metric: 'BMI', value: 23.5, status: 'normal', target: '18.5-24.9' },
  { metric: 'Daily Steps', value: 8500, status: 'good', target: '10,000' },
  { metric: 'Water Intake', value: 2.1, status: 'good', target: '2.5L' },
  { metric: 'Sleep Hours', value: 7.2, status: 'good', target: '7-9h' },
];

const recentAnalyses = [
  { date: '2025-01-09', food: 'Quinoa Salad', risk: 'Low', confidence: 92 },
  { date: '2025-01-08', food: 'Grilled Salmon', risk: 'Low', confidence: 88 },
  { date: '2025-01-07', food: 'Processed Burger', risk: 'High', confidence: 85 },
  { date: '2025-01-06', food: 'Greek Yogurt', risk: 'Low', confidence: 94 },
];

export default function DashboardPage() {
  const [selectedMetric, setSelectedMetric] = useState('calories');

  return (
    <div className="min-h-screen pt-20 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Health Dashboard
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
                Your personalized health insights and progress tracking
              </p>
            </div>
            <div className="flex space-x-3">
              <Link href="/health-analysis">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600">
                  New Analysis
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Calories</CardTitle>
              <Apple className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,150</div>
              <p className="text-xs text-muted-foreground">
                Target: 2,200 (98%)
              </p>
              <Progress value={98} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Score</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85/100</div>
              <p className="text-xs text-muted-foreground">
                +5 from last week
              </p>
              <div className="mt-3">
                <Badge variant="outline" className="text-green-600 bg-green-50">
                  Excellent
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
              <Brain className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Low</div>
              <p className="text-xs text-muted-foreground">
                92% confidence
              </p>
              <div className="mt-3">
                <Badge variant="outline" className="text-green-600 bg-green-50">
                  Healthy
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Analyses Done</CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">
                +12 this week
              </p>
              <div className="mt-3">
                <Badge variant="outline" className="text-purple-600 bg-purple-50">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Progress Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Weekly Calorie Intake
                </CardTitle>
                <CardDescription>
                  Your daily calorie consumption vs target
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="calories" 
                      stroke="#3b82f6" 
                      fill="#dbeafe" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#ef4444" 
                      strokeDasharray="5 5"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Risk Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-600" />
                  Health Risk Distribution
                </CardTitle>
                <CardDescription>
                  Analysis of your food choices over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-6 mt-4">
                  {riskDistribution.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Nutrition Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-green-600" />
                  Daily Nutrition Goals
                </CardTitle>
                <CardDescription>
                  Progress towards your daily targets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nutritionData.map((item, index) => {
                    const percentage = (item.value / item.target) * 100;
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-muted-foreground">
                            {item.value}/{item.target}{item.unit}
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {percentage.toFixed(0)}% of target
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Health Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-orange-600" />
                  Health Metrics
                </CardTitle>
                <CardDescription>
                  Key health indicators and targets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <div className="font-medium">{metric.metric}</div>
                        <div className="text-sm text-muted-foreground">
                          Target: {metric.target}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{metric.value}</div>
                        <Badge
                          variant={metric.status === 'good' ? 'default' : 'secondary'}
                          className={
                            metric.status === 'good'
                              ? 'text-green-600 bg-green-50'
                              : 'text-yellow-600 bg-yellow-50'
                          }
                        >
                          {metric.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Analyses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-blue-600" />
                  Recent Analyses
                </CardTitle>
                <CardDescription>
                  Your latest food health assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAnalyses.map((analysis, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{analysis.food}</div>
                        <div className="text-xs text-muted-foreground">{analysis.date}</div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={analysis.risk === 'Low' ? 'default' : 'destructive'}
                          className={
                            analysis.risk === 'Low'
                              ? 'text-green-600 bg-green-50'
                              : 'text-red-600 bg-red-50'
                          }
                        >
                          {analysis.risk}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {analysis.confidence}% confidence
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <Link href="/health-analysis">
                    <Button variant="outline" size="sm" className="w-full">
                      View All Analyses
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Health Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
                Personalized Recommendations
              </CardTitle>
              <CardDescription>
                AI-generated insights based on your health data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Increase Fiber Intake
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    You're getting 28g of fiber daily. Aim for 35g by adding more vegetables and whole grains.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    Great Protein Balance
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Your protein intake is well-balanced. Keep including lean sources like fish and legumes.
                  </p>
                </div>
                
                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                    Watch Sodium Levels
                  </h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Consider reducing processed foods to lower sodium intake and support heart health.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}