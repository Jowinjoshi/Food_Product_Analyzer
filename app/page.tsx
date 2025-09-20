'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Brain, Utensils, Heart, Shield, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning algorithms analyze your food choices and predict health risks with 85%+ accuracy.',
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    icon: Utensils,
    title: 'Food Database',
    description: 'Access comprehensive nutritional information for thousands of food items with detailed macro and micronutrients.',
    color: 'text-green-600 dark:text-green-400'
  },
  {
    icon: Heart,
    title: 'Health Predictions',
    description: 'Get personalized disease risk predictions for diabetes, heart disease, hypertension, and more conditions.',
    color: 'text-red-500 dark:text-red-400'
  },
  {
    icon: Shield,
    title: 'Preventive Care',
    description: 'Receive actionable recommendations to improve your health and reduce disease risks through better nutrition.',
    color: 'text-purple-600 dark:text-purple-400'
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Monitor your health metrics over time and track improvements in your nutritional choices.',
    color: 'text-orange-600 dark:text-orange-400'
  },
  {
    icon: Users,
    title: 'Expert Insights',
    description: 'Get insights backed by nutritional science and recommendations from health professionals.',
    color: 'text-teal-600 dark:text-teal-400'
  }
];

const stats = [
  { number: '85%+', label: 'Prediction Accuracy', description: 'AI model accuracy' },
  { number: '10K+', label: 'Food Items', description: 'In our database' },
  { number: '15+', label: 'Health Conditions', description: 'Risk predictions' },
  { number: '35+', label: 'Nutritional Factors', description: 'Analyzed per assessment' },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16 mx-auto max-w-7xl lg:px-8 lg:pt-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-gradient-to-r from-blue-100/50 to-green-100/50 dark:from-blue-950/20 dark:to-green-950/20 shadow-xl shadow-blue-600/10 ring-1 ring-blue-50 dark:ring-blue-950 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
        </div>

        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8 flex justify-center"
            >
              <div className="relative rounded-full px-4 py-2 text-sm leading-6 text-gray-600 dark:text-gray-300 ring-1 ring-gray-900/10 dark:ring-gray-100/10 hover:ring-gray-900/20 dark:hover:ring-gray-100/20 transition-all duration-300">
                Powered by XGBoost ML & Advanced Analytics{' '}
                <Link href="/health-analysis" className="font-semibold text-blue-600 dark:text-blue-400">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Try Now <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl"
            >
              Smart Food Analysis &{' '}
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Health Prediction
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300"
            >
              Harness the power of AI to analyze your food choices and predict health risks. Get personalized 
              recommendations to improve your nutrition and prevent diseases before they occur.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/health-analysis">
                <Button size="lg" className="group bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 text-lg">
                  Start Health Analysis
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/food-search">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                  Search Foods
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16 mx-auto max-w-7xl lg:px-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
                {stat.number}
              </div>
              <div className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                {stat.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24 mx-auto max-w-7xl lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Advanced Features Powered by AI
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Experience the future of personalized health and nutrition analysis
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 mx-auto max-w-7xl lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative isolate overflow-hidden bg-gradient-to-r from-blue-600 to-green-600 px-6 py-24 text-center shadow-2xl rounded-3xl sm:px-16"
        >
          <div className="absolute -top-24 right-0 -z-10 transform-gpu blur-3xl" aria-hidden="true">
            <div className="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-blue-400 to-green-400 opacity-25" />
          </div>
          
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Transform Your Health?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
            Join thousands of users who have improved their health with AI-powered food analysis and personalized recommendations.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/health-analysis">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                Get Your Health Analysis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold">
                View Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}