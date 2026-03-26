'use client'

import { useState } from 'react'
import { Code, Database, Globe, Server, Smartphone, Zap, Shield, Cpu, Cloud, GitBranch, Terminal, Package, Mail } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function DeveloperClient() {
  const [activeTab, setActiveTab] = useState('architecture')

  const techStack = [
    { name: 'Next.js 14', icon: Globe, color: 'text-gray-800', description: 'React framework with App Router', url: 'https://nextjs.org/docs' },
    { name: 'TypeScript', icon: Code, color: 'text-blue-600', description: 'Type-safe JavaScript', url: 'https://www.typescriptlang.org/docs' },
    { name: 'Tailwind CSS', icon: Smartphone, color: 'text-cyan-600', description: 'Utility-first CSS framework', url: 'https://tailwindcss.com/docs' },
    { name: 'Firebase', icon: Database, color: 'text-orange-600', description: 'Backend-as-a-Service', url: 'https://firebase.google.com/docs' },
    { name: 'Vercel', icon: Cloud, color: 'text-gray-900', description: 'Deployment platform', url: 'https://vercel.com/docs' },
    { name: 'Lucide React', icon: Zap, color: 'text-purple-600', description: 'Icon library', url: 'https://lucide.dev/docs' }
  ]

  const features = [
    {
      title: 'Server-Side Rendering',
      description: 'Improved SEO and performance with Next.js SSR',
      icon: Server
    },
    {
      title: 'TypeScript Support',
      description: 'Full type safety for better development experience',
      icon: Code
    },
    {
      title: 'Responsive Design',
      description: 'Mobile-first approach with Tailwind CSS',
      icon: Smartphone
    },
    {
      title: 'Real-time Database',
      description: 'Firestore for instant data synchronization',
      icon: Database
    },
    {
      title: 'Progressive Web App',
      description: 'Offline support and app-like experience',
      icon: Globe
    },
    {
      title: 'API Integration',
      description: 'RESTful APIs for external services',
      icon: Zap
    }
  ]

  const architecture = [
    {
      component: 'Frontend',
      technologies: ['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS'],
      description: 'Modern React-based frontend with server-side rendering'
    },
    {
      component: 'Backend',
      technologies: ['Firebase Firestore', 'Firebase Authentication', 'Cloud Functions'],
      description: 'Serverless backend with real-time database'
    },
    {
      component: 'Deployment',
      technologies: ['Vercel', 'Firebase Hosting', 'CDN'],
      description: 'Global CDN with automatic deployments'
    },
    {
      component: 'Analytics',
      technologies: ['Google Analytics', 'Microsoft Clarity', 'Ahrefs Analytics'],
      description: 'Comprehensive tracking and insights'
    }
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Code className="w-10 h-10 text-blue-600" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Developer Documentation
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Technical architecture and implementation details of PakBizBranches - Pakistan's leading business directory platform
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {['architecture', 'tech-stack', 'features', 'api'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Architecture Tab */}
          {activeTab === 'architecture' && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <GitBranch className="w-6 h-6 text-blue-600" />
                  System Architecture
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {architecture.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.component}</h3>
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Terminal className="w-6 h-6 text-green-600" />
                  Development Workflow
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-blue-600">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Development</h3>
                      <p className="text-gray-600">Local development with Next.js dev server and hot reload</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-blue-600">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Testing</h3>
                      <p className="text-gray-600">Unit tests and integration tests for critical components</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-blue-600">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Deployment</h3>
                      <p className="text-gray-600">Automatic deployment to Vercel on main branch push</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-blue-600">4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Monitoring</h3>
                      <p className="text-gray-600">Real-time monitoring and error tracking</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tech Stack Tab */}
          {activeTab === 'tech-stack' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Cpu className="w-6 h-6 text-purple-600" />
                Technology Stack
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {techStack.map((tech, index) => (
                  <a 
                    key={index} 
                    href={tech.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-center p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow block"
                  >
                    <tech.icon className={`w-12 h-12 mx-auto mb-4 ${tech.color}`} />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{tech.name}</h3>
                    <p className="text-gray-600 text-sm">{tech.description}</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-600" />
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-4 p-6 border border-gray-200 rounded-xl">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* API Tab */}
          {activeTab === 'api' && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Package className="w-6 h-6 text-green-600" />
                  API Documentation
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Firebase Integration</h3>
                    <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm">
                      <div className="mb-2">import { db } from '@/lib/firebase'</div>
                      <div className="mb-2">import { collection, addDoc, getDocs } from 'firebase/firestore'</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Data Structure</h3>
                    <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm">
                      <div>{'{'}</div>
                      <div className="ml-4">businessName: string</div>
                      <div className="ml-4">category: string</div>
                      <div className="ml-4">city: string</div>
                      <div className="ml-4">phone: string</div>
                      <div className="ml-4">email: string</div>
                      <div className="ml-4">address: string</div>
                      <div className="ml-4">description: string</div>
                      <div className="ml-4">status: 'pending' | 'approved'</div>
                      <div className="ml-4">createdAt: Timestamp</div>
                      <div>{'}'}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Email Service</h3>
                    <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm">
                      <div className="mb-2">import { sendBusinessSubmissionEmail } from '@/lib/email-service'</div>
                      <div className="mb-2">await sendBusinessSubmissionEmail(businessData)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Globe className="w-6 h-6 text-blue-600" />
                  Quick Links
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a href="/categories" className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">Browse Categories</h4>
                      <p className="text-sm text-gray-600">View all business categories</p>
                    </div>
                  </a>
                  <a href="/add-business" className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <Package className="w-5 h-5 text-green-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">Add Business</h4>
                      <p className="text-sm text-gray-600">Submit new business listing</p>
                    </div>
                  </a>
                  <a href="/contact" className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <Mail className="w-5 h-5 text-purple-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">Contact Support</h4>
                      <p className="text-sm text-gray-600">Get help and support</p>
                    </div>
                  </a>
                  <a href="/priority" className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">Priority Listing</h4>
                      <p className="text-sm text-gray-600">Get premium visibility</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-red-600" />
                  Security & Performance
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Security Measures</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Firebase Security Rules</li>
                      <li>• Input validation and sanitization</li>
                      <li>• Rate limiting on forms</li>
                      <li>• HTTPS enforcement</li>
                      <li>• XSS protection</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Performance Optimization</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Server-side rendering (SSR)</li>
                      <li>• Image optimization</li>
                      <li>• Code splitting</li>
                      <li>• Caching strategies</li>
                      <li>• CDN deployment</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
