'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Shield, Bell, Database, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    age: 30,
    gender: 'Male',
    height: 175,
    weight: 75,
    activityLevel: 'Moderately Active',
    dietaryPreference: 'Omnivore',
    calorieTarget: 2200,
  });

  const [notifications, setNotifications] = useState({
    healthAlerts: true,
    weeklyReports: true,
    newFeatures: false,
    analysisReminders: true,
  });

  const handleProfileUpdate = () => {
    toast.success('Profile updated successfully!');
  };

  const handleNotificationUpdate = () => {
    toast.success('Notification preferences updated!');
  };

  const exportData = () => {
    toast.success('Data export initiated! Check your downloads.');
  };

  const deleteAccount = () => {
    toast.error('Account deletion is not implemented in this demo.');
  };

  return (
    <div className="min-h-screen pt-20 px-6 pb-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Profile Settings
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
                Manage your account and preferences
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-green-600 bg-green-50 dark:bg-green-950/20">
                Premium User
              </Badge>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center">
                <Database className="h-4 w-4 mr-2" />
                Data & Privacy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details for better health analysis accuracy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={profileData.age}
                        onChange={(e) => setProfileData({ ...profileData, age: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select value={profileData.gender} onValueChange={(value) => setProfileData({ ...profileData, gender: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="calorieTarget">Daily Calorie Target</Label>
                      <Input
                        id="calorieTarget"
                        type="number"
                        value={profileData.calorieTarget}
                        onChange={(e) => setProfileData({ ...profileData, calorieTarget: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={profileData.height}
                        onChange={(e) => setProfileData({ ...profileData, height: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={profileData.weight}
                        onChange={(e) => setProfileData({ ...profileData, weight: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <Button onClick={handleProfileUpdate} size="lg" className="w-full md:w-auto">
                    Update Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Health Summary */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Health Summary</CardTitle>
                  <CardDescription>
                    Your current health metrics based on profile data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">23.5</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">BMI</div>
                      <Badge className="mt-2 text-green-600 bg-green-50 dark:bg-green-950/20">Normal</Badge>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">2,200</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Daily Calories</div>
                      <Badge className="mt-2 text-blue-600 bg-blue-50 dark:bg-blue-950/20">Target Set</Badge>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">85</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Health Score</div>
                      <Badge className="mt-2 text-green-600 bg-green-50 dark:bg-green-950/20">Excellent</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-green-600" />
                    Health & Activity Preferences
                  </CardTitle>
                  <CardDescription>
                    Configure your lifestyle preferences for personalized recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Activity Level</Label>
                      <Select value={profileData.activityLevel} onValueChange={(value) => setProfileData({ ...profileData, activityLevel: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sedentary">Sedentary</SelectItem>
                          <SelectItem value="Lightly Active">Lightly Active</SelectItem>
                          <SelectItem value="Moderately Active">Moderately Active</SelectItem>
                          <SelectItem value="Very Active">Very Active</SelectItem>
                          <SelectItem value="Extremely Active">Extremely Active</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Dietary Preference</Label>
                      <Select value={profileData.dietaryPreference} onValueChange={(value) => setProfileData({ ...profileData, dietaryPreference: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Omnivore">Omnivore</SelectItem>
                          <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                          <SelectItem value="Vegan">Vegan</SelectItem>
                          <SelectItem value="Keto">Keto</SelectItem>
                          <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                          <SelectItem value="Paleo">Paleo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Your preferences help us provide more accurate health predictions and personalized recommendations.
                      All data is securely stored and used only for analysis purposes.
                    </AlertDescription>
                  </Alert>

                  <Button onClick={handleProfileUpdate} size="lg">
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-orange-600" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>
                    Choose what notifications you'd like to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Health Risk Alerts</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Get notified when analysis shows high health risks
                        </p>
                      </div>
                      <Switch
                        checked={notifications.healthAlerts}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, healthAlerts: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Weekly Health Reports</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Receive weekly summaries of your health analysis
                        </p>
                      </div>
                      <Switch
                        checked={notifications.weeklyReports}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Analysis Reminders</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Reminders to perform regular health analysis
                        </p>
                      </div>
                      <Switch
                        checked={notifications.analysisReminders}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, analysisReminders: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>New Features</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Updates about new features and improvements
                        </p>
                      </div>
                      <Switch
                        checked={notifications.newFeatures}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, newFeatures: checked })}
                      />
                    </div>
                  </div>

                  <Button onClick={handleNotificationUpdate} size="lg">
                    Update Notifications
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2 text-purple-600" />
                    Data Management
                  </CardTitle>
                  <CardDescription>
                    Manage your data, privacy settings, and account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Export Your Data</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        Download all your health analysis data, preferences, and history.
                      </p>
                      <Button onClick={exportData} variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Data Usage</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        See how your data is used to improve health predictions.
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Health Analyses:</span>
                          <span className="font-medium">127</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Food Searches:</span>
                          <span className="font-medium">45</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Account Age:</span>
                          <span className="font-medium">3 months</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Privacy Commitment:</strong> Your health data is encrypted and never shared with third parties. 
                      We use it only to provide you with personalized health insights and improve our AI models.
                    </AlertDescription>
                  </Alert>

                  <div className="border-t pt-6">
                    <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">Delete Account</h3>
                      <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <Button onClick={deleteAccount} variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}