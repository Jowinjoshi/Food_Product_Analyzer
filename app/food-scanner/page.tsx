'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, Scan, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface ScannedFood {
  name: string;
  confidence: number;
  nutritional_info: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  health_score: number;
  processing_level: string;
  recommendations: string[];
}

export default function FoodScannerPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<ScannedFood | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanMode, setScanMode] = useState<'upload' | 'camera'>('upload');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setScannedResult(null);
    }
  };

  const simulateScanning = () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    setIsScanning(true);

    // Simulate AI processing delay
    setTimeout(() => {
      // Mock result - in real implementation, this would come from your backend OCR/ML service
      const mockResult: ScannedFood = {
        name: 'Whole Grain Breakfast Cereal',
        confidence: 89,
        nutritional_info: {
          calories: 110,
          protein: 3,
          carbohydrates: 23,
          fat: 1.5,
          fiber: 4,
          sugar: 6,
          sodium: 160,
        },
        health_score: 78,
        processing_level: 'Minimally Processed',
        recommendations: [
          'Good source of fiber and whole grains',
          'Consider pairing with fresh fruit for added nutrients',
          'Watch portion sizes due to sugar content',
          'Choose unsweetened versions when possible'
        ]
      };

      setScannedResult(mockResult);
      setIsScanning(false);
      toast.success('Food scanned successfully!');
    }, 3000);
  };

  const scanWithOCR = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    setIsScanning(true);

    try {
      // Create FormData to send the image
      const formData = new FormData();
      formData.append('image', selectedImage);

      // Call the OCR API endpoint
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/scan_label`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to scan label');
      }

      const result = await response.json();
      setScannedResult(result);
      toast.success('Label scanned successfully with OCR!');
    } catch (error) {
      console.error('OCR scanning error:', error);
      toast.error(`Failed to scan label: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsScanning(false);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    setVideoReady(false);
    
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser');
      }

      console.log('Starting camera...');

      // Simple constraints first
      const constraints = {
        video: true,
        audio: false
      };

      // Add timeout to prevent hanging on permission prompt
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Camera access timed out. Please check permissions.')), 15000);
      });

      const mediaStream = await Promise.race([
        navigator.mediaDevices.getUserMedia(constraints),
        timeoutPromise
      ]);
      
      console.log('Got media stream:', mediaStream);

      setStream(mediaStream);
      setIsCameraActive(true);
      setScanMode('camera');

      if (videoRef.current) {
        console.log('Setting video source...');
        videoRef.current.srcObject = mediaStream;
        
        // Simple approach - just play the video
        try {
          await videoRef.current.play();
          console.log('Video playing successfully');
          setVideoReady(true);
          toast.success('Camera started successfully!');
        } catch (playError) {
          console.error('Error playing video:', playError);
          throw new Error('Could not start video playback');
        }
      }

      // Clear any previous selections
      setSelectedImage(null);
      setImagePreview(null);
      setScannedResult(null);

    } catch (error) {
      console.error('Error accessing camera:', error);
      let errorMessage = 'Could not access camera. ';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Camera access denied. Please allow camera permissions in your browser settings and refresh the page.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No camera found on this device.';
        } else if (error.name === 'NotSupportedError') {
          errorMessage = 'Camera not supported in this browser.';
        } else if (error.message.includes('timed out')) {
          errorMessage = 'Camera access timed out. Please check if you clicked "Allow" for camera permissions.';
        } else {
          errorMessage += error.message;
        }
      }
      
      setCameraError(errorMessage);
      toast.error(errorMessage);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    if (stream) {
      stream.getTracks().forEach(track => {
        console.log('Stopping track:', track);
        track.stop();
      });
      setStream(null);
    }
    setIsCameraActive(false);
    setVideoReady(false);
    setCameraError(null);
    setScanMode('upload');
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !videoReady) {
      toast.error('Camera not ready. Please wait for the video to load.');
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;

    console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);

    const context = canvas.getContext('2d');
    if (!context) {
      toast.error('Could not get canvas context');
      return;
    }

    // Use actual video dimensions or fallback
    const width = video.videoWidth || video.offsetWidth || 640;
    const height = video.videoHeight || video.offsetHeight || 480;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    try {
      // Draw the video frame to canvas
      context.drawImage(video, 0, 0, width, height);
      console.log('Drew video frame to canvas');

      // Convert canvas to blob and create file
      canvas.toBlob((blob) => {
        if (blob) {
          console.log('Created blob:', blob.size, 'bytes');
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          setSelectedImage(file);

          // Create preview URL
          const previewUrl = URL.createObjectURL(blob);
          setImagePreview(previewUrl);

          // Stop camera after capture
          stopCamera();

          toast.success('Photo captured! You can now scan it.');
        } else {
          toast.error('Failed to create image from camera');
        }
      }, 'image/jpeg', 0.9);
    } catch (error) {
      console.error('Error capturing photo:', error);
      toast.error('Failed to capture photo');
    }
  };

  const scanLiveCamera = async () => {
    if (!videoRef.current || !canvasRef.current) {
      toast.error('Camera not ready');
      return;
    }

    const video = videoRef.current;
    if (!video.videoWidth || !video.videoHeight) {
      toast.error('Video not ready yet. Please wait a moment.');
      return;
    }

    setIsScanning(true);

    try {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Could not get canvas context');
      }

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to capture image from canvas'));
          }
        }, 'image/jpeg', 0.9);
      });

      // Create FormData to send the image
      const formData = new FormData();
      const file = new File([blob], 'live-capture.jpg', { type: 'image/jpeg' });
      formData.append('image', file);

      // Call the OCR API endpoint
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/scan_label`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to scan label');
      }

      const result = await response.json();
      setScannedResult(result);
      
      // Stop camera after successful scan
      stopCamera();
      
      toast.success('Label scanned successfully from camera!');
    } catch (error) {
      console.error('Live OCR scanning error:', error);
      toast.error(`Failed to scan label: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsScanning(false);
    }
  };

  // Cleanup camera stream on component unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 dark:bg-green-950/20';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20';
    return 'text-red-600 bg-red-50 dark:bg-red-950/20';
  };

  const getProcessingLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'unprocessed': return 'bg-green-500';
      case 'minimally processed': return 'bg-yellow-500';
      case 'processed': return 'bg-orange-500';
      case 'ultra-processed': return 'bg-red-500';
      default: return 'bg-gray-500';
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
            <Scan className="h-12 w-12 text-purple-600 mr-4" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Food Label Scanner
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Scan food labels with AI to get instant nutritional analysis and health insights
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scanner Interface */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-5 w-5 mr-2 text-purple-600" />
                  Food Scanner & Label Reader
                </CardTitle>
                <CardDescription>
                  Upload food images for OCR label reading or AI-powered food identification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mode Selection */}
                <div className="flex space-x-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <button
                    onClick={() => {
                      setScanMode('upload');
                      stopCamera();
                    }}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      scanMode === 'upload'
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Upload className="h-4 w-4 inline mr-2" />
                    Upload Image
                  </button>
                  <button
                    onClick={() => setScanMode('camera')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      scanMode === 'camera'
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Camera className="h-4 w-4 inline mr-2" />
                    Use Camera
                  </button>
                </div>

                {/* Content Area */}
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center min-h-[300px] flex items-center justify-center">
                  {scanMode === 'upload' ? (
                    // Upload Mode
                    imagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={imagePreview}
                          alt="Selected food label"
                          className="max-w-full h-64 object-contain mx-auto rounded-lg"
                        />
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Selected: {selectedImage?.name}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="h-16 w-16 mx-auto text-gray-400" />
                        <div>
                          <p className="text-lg font-medium text-gray-900 dark:text-white">
                            Upload Food Label Image
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            PNG, JPG up to 10MB
                          </p>
                        </div>
                      </div>
                    )
                  ) : (
                    // Camera Mode
                    <div className="w-full space-y-4">
                      {isCameraActive ? (
                        <div className="relative w-full max-w-md mx-auto">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-auto rounded-lg shadow-lg bg-black"
                            style={{ 
                              minHeight: '300px',
                              maxHeight: '400px'
                            }}
                            onLoadedData={() => {
                              console.log('Video loaded data');
                              setVideoReady(true);
                            }}
                            onCanPlay={() => {
                              console.log('Video can play');
                              setVideoReady(true);
                            }}
                            onError={(e) => {
                              console.error('Video error:', e);
                              setCameraError('Video playback error');
                            }}
                          />
                          
                          {/* Scanning frame overlay - only show when video is ready */}
                          {videoReady && (
                            <>
                              <div className="absolute inset-0 border-2 border-green-500 rounded-lg pointer-events-none">
                                <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-green-500"></div>
                                <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-green-500"></div>
                                <div className="absolute bottom-8 left-4 w-8 h-8 border-l-4 border-b-4 border-green-500"></div>
                                <div className="absolute bottom-8 right-4 w-8 h-8 border-r-4 border-b-4 border-green-500"></div>
                              </div>
                              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm">
                                📱 Align nutrition label within frame
                              </div>
                            </>
                          )}
                          
                          {/* Loading/Error overlay */}
                          {!videoReady && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 rounded-lg">
                              <div className="text-white text-center p-4 max-w-xs">
                                {cameraError ? (
                                  <>
                                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-400" />
                                    <p className="text-sm text-red-400 mb-2">{cameraError}</p>
                                    <Button
                                      onClick={() => {
                                        setCameraError(null);
                                        startCamera();
                                      }}
                                      size="sm"
                                      variant="outline"
                                      className="text-xs border-white text-white hover:bg-white hover:text-black"
                                    >
                                      Try Again
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-3"></div>
                                    <p className="text-sm font-medium mb-2">Waiting for camera access...</p>
                                    <div className="text-xs text-gray-300 space-y-1">
                                      <p>📱 Look for camera permission popup</p>
                                      <p>🔒 Check address bar for camera icon</p>
                                      <p>✅ Click "Allow" when prompted</p>
                                    </div>
                                    <Button
                                      onClick={stopCamera}
                                      size="sm"
                                      variant="outline"
                                      className="mt-3 text-xs border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                                    >
                                      Cancel
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Camera className="h-16 w-16 mx-auto text-gray-400" />
                          <div>
                            <p className="text-lg font-medium text-gray-900 dark:text-white">
                              Camera Scanner
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Point camera at food label to scan
                            </p>
                          </div>
                        </div>
                      )}
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {scanMode === 'upload' ? (
                    // Upload Mode Buttons
                    <div className="space-y-3">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        size="lg"
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Image
                      </Button>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button
                          onClick={scanWithOCR}
                          size="lg"
                          disabled={!selectedImage || isScanning}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                          {isScanning ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Reading...
                            </>
                          ) : (
                            <>
                              <Scan className="h-4 w-4 mr-2" />
                              Scan Label (OCR)
                            </>
                          )}
                        </Button>
                        
                        <Button
                          onClick={simulateScanning}
                          size="lg"
                          disabled={!selectedImage || isScanning}
                          variant="outline"
                          className="border-purple-600 text-purple-600 hover:bg-purple-50"
                        >
                          {isScanning ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Scan className="h-4 w-4 mr-2" />
                              AI Food Scan
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Camera Mode Buttons
                    <div className="space-y-3">
                      {!isCameraActive ? (
                        <div className="space-y-2">
                          <Button
                            onClick={startCamera}
                            size="lg"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Start Camera
                          </Button>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              onClick={async () => {
                                try {
                                  const devices = await navigator.mediaDevices.enumerateDevices();
                                  const videoDevices = devices.filter(device => device.kind === 'videoinput');
                                  console.log('Available cameras:', videoDevices);
                                  toast.success(`Found ${videoDevices.length} camera(s). Check console for details.`);
                                } catch (error) {
                                  console.error('Error checking cameras:', error);
                                  toast.error('Could not check available cameras');
                                }
                              }}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              🔍 Test Cameras
                            </Button>
                            <Button
                              onClick={async () => {
                                try {
                                  const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
                                  console.log('Camera permission status:', permission.state);
                                  
                                  let message = `Camera permission: ${permission.state}`;
                                  if (permission.state === 'denied') {
                                    message += ' - You need to manually enable camera access in browser settings';
                                  } else if (permission.state === 'prompt') {
                                    message += ' - Browser will ask for permission when you start camera';
                                  }
                                  
                                  toast.info(message);
                                } catch (error) {
                                  console.log('Current browser:', navigator.userAgent);
                                  console.log('MediaDevices supported:', !!navigator.mediaDevices);
                                  console.log('getUserMedia supported:', !!navigator.mediaDevices?.getUserMedia);
                                  toast.info('Permission check not supported. Browser info logged to console');
                                }
                              }}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              � Check Permissions
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <Button
                              onClick={capturePhoto}
                              size="lg"
                              variant="outline"
                              disabled={!videoReady}
                              className="border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                            >
                              <Camera className="h-4 w-4 mr-2" />
                              Capture
                            </Button>
                            
                            <Button
                              onClick={scanLiveCamera}
                              size="lg"
                              disabled={isScanning || !videoReady}
                              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
                            >
                              {isScanning ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                  Scanning...
                                </>
                              ) : (
                                <>
                                  <Scan className="h-4 w-4 mr-2" />
                                  Scan Now
                                </>
                              )}
                            </Button>
                            
                            <Button
                              onClick={stopCamera}
                              size="lg"
                              variant="outline"
                              className="border-red-600 text-red-600 hover:bg-red-50"
                            >
                              Stop
                            </Button>
                          </div>
                          {!videoReady && (
                            <p className="text-xs text-center text-gray-500">
                              Waiting for camera to load...
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                {/* Instructions */}
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Scanning Options:</strong>
                    <div className="mt-2 space-y-2 text-sm">
                      <div>
                        <strong>Camera Scanner:</strong> Real-time camera scanning for instant label reading
                      </div>
                      <div>
                        <strong>Upload Mode:</strong> Upload images for OCR scanning or AI food identification
                      </div>
                    </div>
                    <strong className="block mt-3">Camera Permission Steps:</strong>
                    <ul className="mt-1 space-y-1 text-sm">
                      <li>• Look for camera 📷 icon in your browser's address bar</li>
                      <li>• Click "Allow" when browser asks for camera permission</li>
                      <li>• If blocked, click the 🔒 icon → Camera → Allow</li>
                      <li>• Refresh the page after changing permissions</li>
                    </ul>
                    <strong className="block mt-3">Scanning Tips:</strong>
                    <ul className="mt-1 space-y-1 text-sm">
                      <li>• Hold device steady with good lighting</li>
                      <li>• Align nutrition label within the green frame</li>
                      <li>• Use "Check Permissions" button if camera won't start</li>
                    </ul>
                    <strong className="block mt-3">Upload Scanning Tips:</strong>
                    <ul className="mt-1 space-y-1 text-sm">
                      <li>• Include the entire nutrition facts panel</li>
                      <li>• Make sure text is in focus and readable</li>
                      <li>• Choose between OCR (labels) or AI (food identification)</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Scan Results
                </CardTitle>
                <CardDescription>
                  AI-powered nutritional analysis and health insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!scannedResult && !isScanning && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Scan className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Upload and scan a food label to see results</p>
                  </div>
                )}

                {isScanning && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                      Analyzing food label...
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Using AI to extract nutritional information
                    </p>
                  </div>
                )}

                {scannedResult && (
                  <div className="space-y-6">
                    {/* Food Identification */}
                    <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {scannedResult.name}
                      </h3>
                      <div className="flex items-center justify-center space-x-4">
                        <Badge className={getHealthScoreColor(scannedResult.health_score)}>
                          Health Score: {scannedResult.health_score}/100
                        </Badge>
                        <Badge variant="outline" className="flex items-center">
                          <div className={`w-2 h-2 rounded-full ${getProcessingLevelColor(scannedResult.processing_level)} mr-2`} />
                          {scannedResult.processing_level}
                        </Badge>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-300">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {scannedResult.confidence}% confidence
                        </div>
                      </div>
                    </div>

                    {/* Nutritional Information */}
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Nutritional Information (per serving)</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Calories</span>
                            <span className="font-medium">{scannedResult.nutritional_info.calories}</span>
                          </div>
                          <Progress value={(scannedResult.nutritional_info.calories / 400) * 100} className="h-2" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Protein</span>
                            <span className="font-medium">{scannedResult.nutritional_info.protein}g</span>
                          </div>
                          <Progress value={(scannedResult.nutritional_info.protein / 20) * 100} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Carbs</span>
                            <span className="font-medium">{scannedResult.nutritional_info.carbohydrates}g</span>
                          </div>
                          <Progress value={(scannedResult.nutritional_info.carbohydrates / 50) * 100} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Fat</span>
                            <span className="font-medium">{scannedResult.nutritional_info.fat}g</span>
                          </div>
                          <Progress value={(scannedResult.nutritional_info.fat / 20) * 100} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Fiber</span>
                            <span className="font-medium">{scannedResult.nutritional_info.fiber}g</span>
                          </div>
                          <Progress value={(scannedResult.nutritional_info.fiber / 10) * 100} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Sugar</span>
                            <span className="font-medium">{scannedResult.nutritional_info.sugar}g</span>
                          </div>
                          <Progress value={(scannedResult.nutritional_info.sugar / 25) * 100} className="h-2" />
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Sodium</span>
                          <span className="font-medium">{scannedResult.nutritional_info.sodium}mg</span>
                        </div>
                        <Progress value={(scannedResult.nutritional_info.sodium / 2300) * 100} className="h-2 mt-2" />
                        <p className="text-xs text-gray-500 mt-1">
                          {((scannedResult.nutritional_info.sodium / 2300) * 100).toFixed(0)}% of daily value
                        </p>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h4 className="text-lg font-semibold mb-3 flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                        AI Recommendations
                      </h4>
                      <div className="space-y-2">
                        {scannedResult.recommendations.map((rec, index) => (
                          <Alert key={index} className="border-blue-200 dark:border-blue-800">
                            <Info className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                              {rec}
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </div>

                    {/* Health Score Breakdown */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-lg">
                      <h4 className="font-semibold mb-2">Health Score Breakdown</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Nutritional Density</span>
                          <span className="text-green-600">+25 points</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Processing Level</span>
                          <span className="text-yellow-600">+20 points</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ingredient Quality</span>
                          <span className="text-green-600">+18 points</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sugar Content</span>
                          <span className="text-yellow-600">+15 points</span>
                        </div>
                        <div className="border-t pt-1 mt-2 font-medium">
                          <div className="flex justify-between">
                            <span>Total Score</span>
                            <span>{scannedResult.health_score}/100</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Feature Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>How Food Label Scanning Works</CardTitle>
              <CardDescription>
                Our AI-powered system analyzes food labels to provide instant health insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-950/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">1. Capture or Upload</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Take a photo or upload an image of any food label with clear nutritional information.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-950/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Scan className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">2. AI Analysis</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Our advanced OCR and ML models extract and analyze nutritional data from the label.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-950/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">3. Health Insights</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Get instant health scores, processing levels, and personalized recommendations.
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