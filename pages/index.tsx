import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheckIcon,
  CameraIcon,
  RocketLaunchIcon,
  UserGroupIcon,
  BoltIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  EyeIcon,
  LockClosedIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';

import ParticleLayout from '../components/Layout/ParticleLayout';
import Button from '@/components/Atom/Button';
import Card from '@/components/Atom/Card';

const Home = () => {
  const features = [
    {
      icon: <CameraIcon className="w-8 h-8 text-primary-600" />,
      title: 'Advanced Face Recognition',
      description:
        'Cutting-edge facial recognition using HOG algorithm and dlib library for accurate authentication.',
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8 text-primary-600" />,
      title: 'OAuth 2.0 Integration',
      description:
        'Seamless integration with third-party platforms through industry-standard OAuth 2.0 protocol.',
    },
    {
      icon: <BoltIcon className="w-8 h-8 text-primary-600" />,
      title: 'Real-time Processing',
      description:
        'Lightning-fast facial recognition processing for enhanced security and user experience.',
    },
    {
      icon: <LockClosedIcon className="w-8 h-8 text-primary-600" />,
      title: 'Secure Token System',
      description:
        'Advanced token-based authentication with device fingerprinting for maximum security.',
    },
    {
      icon: <GlobeAltIcon className="w-8 h-8 text-primary-600" />,
      title: 'Cross-Platform Support',
      description:
        'Works across all devices and platforms with responsive design and easy integration.',
    },
    {
      icon: <UserGroupIcon className="w-8 h-8 text-primary-600" />,
      title: 'Developer Friendly',
      description:
        'Open-source codebase with comprehensive documentation for easy integration and customization.',
    },
  ];

  const benefits = [
    'Eliminate fake accounts and strengthen online security',
    'Provide seamless user experience with one-click authentication',
    'Reduce password fatigue and security vulnerabilities',
    'Enable third-party accessibility through OAuth 2.0',
    'Offer real-time authentication with face recognition',
    'Support multiple devices with device fingerprinting',
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Register Your Face',
      description:
        'Scan your face using our advanced recognition system to create your unique biometric profile.',
      icon: <CameraIcon className="w-6 h-6" />,
    },
    {
      step: 2,
      title: 'Third-Party Integration',
      description:
        'Connect with any OAuth 2.0 compatible application or service seamlessly.',
      icon: <GlobeAltIcon className="w-6 h-6" />,
    },
    {
      step: 3,
      title: 'Secure Authentication',
      description:
        'Login instantly with face recognition - no passwords, no hassle, maximum security.',
      icon: <ShieldCheckIcon className="w-6 h-6" />,
    },
  ];

  return (
    <ParticleLayout
      title="Face Guardian - Secure Authentication"
      restrict={false}
    >
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Hero Content */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                  Welcome to{' '}
                  <span className="text-primary-600">Face Guardian</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                  Revolutionizing Online Authentication for a Safer and More
                  Convenient User Experience
                </p>
                <p className="text-lg text-gray-500 mb-10">
                  Experience the future of authentication with our cutting-edge
                  facial recognition technology combined with OAuth 2.0
                  protocol.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/register">
                    <Button size="lg" className="w-full sm:w-auto">
                      <RocketLaunchIcon className="w-5 h-5 mr-2" />
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      <EyeIcon className="w-5 h-5 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Hero Image */}
              <div className="flex-1 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-100 rounded-full blur-3xl opacity-30"></div>
                  <Image
                    src="/fg-logo.png"
                    alt="Face Guardian Logo"
                    width={400}
                    height={400}
                    className="relative z-10 animate-fadeIn"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Powerful Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover what makes Face Guardian the most secure and convenient
                authentication solution
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get started with Face Guardian in three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full mx-auto mb-4">
                    <span className="text-2xl font-bold">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  <div className="flex justify-center text-primary-600">
                    {step.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Why Choose Face Guardian?
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Our innovative solution addresses the prevalent issue of fake
                  accounts while providing a seamless authentication experience.
                </p>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <Card className="p-6 bg-primary-50 border-primary-200">
                  <div className="flex items-center mb-4">
                    <ShieldCheckIcon className="w-8 h-8 text-primary-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      Enterprise Security
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    Industry-leading security measures with biometric
                    authentication and device fingerprinting.
                  </p>
                </Card>

                <Card className="p-6 bg-blue-50 border-blue-200">
                  <div className="flex items-center mb-4">
                    <DevicePhoneMobileIcon className="w-8 h-8 text-blue-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      Cross-Platform
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    Works seamlessly across all devices and platforms with
                    responsive design.
                  </p>
                </Card>

                <Card className="p-6 bg-green-50 border-green-200">
                  <div className="flex items-center mb-4">
                    <BoltIcon className="w-8 h-8 text-green-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      Lightning Fast
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    Real-time processing ensures quick and efficient
                    authentication every time.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-primary-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Experience the Future of Authentication?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of users who have already made the switch to
              secure, convenient facial authentication.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto bg-white text-primary-600 hover:bg-gray-100"
                >
                  <RocketLaunchIcon className="w-5 h-5 mr-2" />
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary-600"
                >
                  Sign In Now
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Image
                src="/fg-logo.png"
                alt="Face Guardian"
                width={40}
                height={40}
                className="mr-3"
              />
              <span className="text-xl font-bold">Face Guardian</span>
            </div>
            <p className="text-gray-400 mb-4">
              Revolutionizing online authentication with cutting-edge facial
              recognition technology.
            </p>
            <div className="flex justify-center items-center text-sm text-gray-500">
              <ShieldCheckIcon className="w-4 h-4 mr-2" />
              <span>
                Secured by Face Guardian • © 2024 All rights reserved
              </span>
            </div>
          </div>
        </footer>
      </div>
    </ParticleLayout>
  );
};

export default Home;
