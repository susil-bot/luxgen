import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  Users, 
  BookOpen, 
  BarChart3, 
  Shield, 
  Brain,
  TrendingUp,
  Target,
  Zap,
  Award,
  Clock,
  Star,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  LineChart,
  PieChart,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  Database,
  Lock,
  Eye,
  Download,
  Share2,
  MessageSquare,
  Calendar,
  DollarSign,
  Percent,
  ArrowUpRight,
  Check,
  X,
  Plus,
  Minus
} from 'lucide-react';
import Header from '../header/Header';

const LandingPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState('standards');
  const [animatedNumbers, setAnimatedNumbers] = useState({
    users: 0,
    organizations: 0,
    trainingHours: 0,
    roi: 0
  });

  // Custom navigation for landing page
  const landingNavigation = [
    { label: 'Features', href: '#features' },
    { label: 'AI Capabilities', href: '#ai-capabilities' },
    { label: 'ROI Calculator', href: '#roi-calculator' },
    { label: 'Demo', href: '#demo' },
  ];

  // Auto-advancing testimonial slides
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Animate numbers on scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateNumbers();
        }
      });
    });

    const element = document.getElementById('stats-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const animateNumbers = () => {
    const targets = { users: 50000, organizations: 1200, trainingHours: 250000, roi: 340 };
    const duration = 2000;
    const steps = 60;
    const stepValue = targets.users / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setAnimatedNumbers({
        users: Math.min(Math.floor(currentStep * stepValue), targets.users),
        organizations: Math.min(Math.floor(currentStep * stepValue / 41.67), targets.organizations),
        trainingHours: Math.min(Math.floor(currentStep * stepValue * 5), targets.trainingHours),
        roi: Math.min(Math.floor(currentStep * stepValue / 147.06), targets.roi)
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedNumbers(targets);
      }
    }, duration / steps);
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Training Director",
      company: "TechCorp Inc.",
      content: "LuxGen.AI transformed our training standards. We've seen a 340% ROI improvement and 85% faster content creation.",
      avatar: "👩‍💼"
    },
    {
      name: "Michael Chen",
      role: "HR Manager",
      company: "Global Solutions",
      content: "The AI-powered tracking and reporting features have given us unprecedented insights into our training effectiveness.",
      avatar: "👨‍💼"
    },
    {
      name: "Emily Rodriguez",
      role: "Learning Specialist",
      company: "InnovateLabs",
      content: "Our training standards have improved dramatically. The platform's AI capabilities are game-changing for content creation.",
      avatar: "👩‍🎓"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "LuxGen.AI Intelligence",
      description: "Advanced AI-powered content generation, personalized learning paths, and intelligent assessment creation",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics & ROI Tracking",
      description: "Real-time performance metrics, predictive analytics, and comprehensive ROI measurement tools",
      color: "from-green-500 to-teal-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: Target,
      title: "Standard Improvement",
      description: "AI-driven content quality assessment, compliance monitoring, and continuous improvement recommendations",
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: Shield,
      title: "Multi-Tenant Security",
      description: "Enterprise-grade security with role-based access control and complete data isolation",
      color: "from-red-500 to-orange-500",
      bgColor: "bg-red-50",
      iconColor: "text-red-600"
    },
    {
      icon: BarChart3,
      title: "Advanced Reporting",
      description: "Comprehensive dashboards, custom reports, and automated insights for data-driven decisions",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600"
    },
    {
      icon: Zap,
      title: "Lightning Fast Performance",
      description: "Optimized for speed with real-time collaboration, instant feedback, and seamless integration",
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600"
    }
  ];

  const aiCapabilities = [
    {
      category: "Content Creation",
      features: [
        "AI-powered training material generation",
        "Automated assessment question creation",
        "Personalized learning path optimization",
        "Multilingual content translation"
      ]
    },
    {
      category: "Analytics & Insights",
      features: [
        "Predictive performance analytics",
        "Real-time engagement tracking",
        "ROI measurement and forecasting",
        "Behavioral pattern analysis"
      ]
    },
    {
      category: "Quality Assurance",
      features: [
        "Content quality scoring",
        "Compliance monitoring",
        "Standard improvement recommendations",
        "Automated quality checks"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header 
        navigationItems={landingNavigation}
        logoProps={{ showText: true }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-white">Powered by LuxGen.AI</span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Transform Training with
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Smart AI Intelligence
              </span>
            </h1>
            
            <p className="mt-6 text-xl leading-8 text-gray-300 max-w-3xl mx-auto">
              Elevate your training standards, track performance with precision, generate comprehensive reports, 
              and achieve unprecedented ROI with our AI-powered platform.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button 
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-8 py-4 text-lg font-semibold text-white hover:bg-white/10 transition-all duration-300"
              >
                <Play className="h-5 w-5" />
                Watch Demo
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex items-center justify-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-400" />
                <span>Enterprise security</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                <span>No setup required</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats-section" className="py-16 bg-gradient-to-r from-gray-50 to-white">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {animatedNumbers.users.toLocaleString()}+
              </div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {animatedNumbers.organizations.toLocaleString()}+
              </div>
              <div className="text-gray-600">Organizations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {animatedNumbers.trainingHours.toLocaleString()}+
              </div>
              <div className="text-gray-600">Training Hours</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {animatedNumbers.roi}%
              </div>
              <div className="text-gray-600">Average ROI</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Everything you need to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                revolutionize training
              </span>
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              From AI-powered content creation to advanced analytics, our platform provides all the tools 
              you need to improve standards, track progress, and maximize ROI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group relative ${feature.bgColor} rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200/50`}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6`}>
                  <feature.icon className={`h-8 w-8 ${feature.iconColor.replace('text-', 'text-white')}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Capabilities Section */}
      <section id="ai-capabilities" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-6">
              <Brain className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">LuxGen.AI Powered</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Intelligent Features That
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Drive Results
              </span>
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Our advanced AI capabilities help you create better content, track performance more effectively, 
              and achieve measurable improvements in training standards and ROI.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {aiCapabilities.map((capability, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200/50">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  {capability.category}
                </h3>
                <ul className="space-y-4">
                  {capability.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive ROI Calculator */}
      <section id="roi-calculator" className="py-20 bg-white">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Calculate Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
                Potential ROI
              </span>
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              See how our platform can improve your training efficiency and deliver measurable returns on investment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">ROI Improvement Factors</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Content Creation Speed</span>
                    <span className="text-green-600 font-semibold">+85%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Training Effectiveness</span>
                    <span className="text-green-600 font-semibold">+67%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Administrative Efficiency</span>
                    <span className="text-green-600 font-semibold">+73%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Standard Compliance</span>
                    <span className="text-green-600 font-semibold">+92%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Key Benefits</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Reduced training development time</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Improved learning outcomes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Better compliance tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Enhanced reporting capabilities</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-slate-800 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-semibold mb-6">ROI Calculator</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Number of Learners
                  </label>
                  <input 
                    type="range" 
                    min="10" 
                    max="1000" 
                    defaultValue="100"
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>10</span>
                    <span>1000</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Training Hours/Month
                  </label>
                  <input 
                    type="range" 
                    min="20" 
                    max="200" 
                    defaultValue="80"
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>20</span>
                    <span>200</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold mb-2">340%</div>
                  <div className="text-sm opacity-90">Projected ROI Improvement</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-400">$127K</div>
                    <div className="text-xs text-gray-400">Annual Savings</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-400">67%</div>
                    <div className="text-xs text-gray-400">Time Saved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Trusted by Industry Leaders
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              See how organizations are transforming their training programs with our AI-powered platform.
            </p>
          </div>

          <div className="relative">
            <div className="flex overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`w-full flex-shrink-0 transition-transform duration-500 ${
                    index === currentSlide ? 'translate-x-0' : 'translate-x-full'
                  }`}
                >
                  <div className="max-w-4xl mx-auto text-center">
                    <div className="text-6xl mb-6">{testimonial.avatar}</div>
                    <blockquote className="text-2xl font-medium text-gray-900 mb-8 leading-relaxed">
                      "{testimonial.content}"
                    </blockquote>
                    <div className="flex items-center justify-center gap-4">
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-gray-600">{testimonial.role} at {testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation controls */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % testimonials.length)}
                className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-white">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Experience the Platform
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Try our platform with demo credentials and see how LuxGen.AI can transform your training programs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                role: 'Super Admin', 
                email: 'superadmin@trainer.com', 
                description: 'Full system access, tenant management, and AI configuration',
                color: 'from-purple-500 to-pink-500',
                icon: Shield
              },
              { 
                role: 'Admin', 
                email: 'admin@trainer.com', 
                description: 'Organization management, user oversight, and reporting',
                color: 'from-blue-500 to-indigo-500',
                icon: Users
              },
              { 
                role: 'Trainer', 
                email: 'trainer@trainer.com', 
                description: 'AI-powered content creation and session management',
                color: 'from-green-500 to-teal-500',
                icon: Brain
              },
              { 
                role: 'User', 
                email: 'user@trainer.com', 
                description: 'Learning consumption and progress tracking',
                color: 'from-orange-500 to-red-500',
                icon: BookOpen
              },
            ].map((demo, index) => (
              <div key={index} className="group relative bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${demo.color} mb-4`}>
                  <demo.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 bg-gradient-to-r ${demo.color} text-white`}>
                  {demo.role}
                </div>
                <p className="font-mono text-sm text-gray-900 mb-2">{demo.email}</p>
                <p className="font-mono text-sm text-gray-600 mb-4">password123</p>
                <p className="text-xs text-gray-500">{demo.description}</p>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Testing Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Platform</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Transform your training programs with AI-powered intelligence. 
                Improve standards, track performance, and achieve measurable ROI.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
                  <Brain className="h-4 w-4 text-purple-400" />
                  <span className="text-sm">LuxGen.AI Powered</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">API</a></li>
                <li><a href="#" className="hover:text-white transition">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Platform. Built with ❤️ for the training community.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 