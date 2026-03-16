'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin, Mail, ChevronRight } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { BLOG_POSTS } from '@/lib/blog-data'

export default function BlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPost() {
      if (!params.slug) return
      
      try {
        const foundPost = BLOG_POSTS.find(p => p.slug === params.slug)
        setPost(foundPost || null)
      } catch (error) {
        console.error('Error fetching post:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPost()
  }, [params.slug])

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading article...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
            <Link href="/blog" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="bg-gray-50">
        {/* Article Header */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-blue-600">Home</Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/blog" className="hover:text-blue-600">Blog</Link>
              </li>
              <li>/</li>
              <li className="text-gray-900 font-medium">{post.title}</li>
            </ol>
          </nav>

          {/* Article Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Featured Image */}
            <div className="h-64 md:h-96 bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <div className="text-center text-white px-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
                <div className="flex items-center justify-center gap-4 text-white/90">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {post.author}
                  </span>
                </div>
              </div>
            </div>

            {/* Article Body */}
            <div className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>

              {/* Article Tags */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {post.keywords.map((keyword: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share Section */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
                <div className="flex gap-3">
                  <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    <Mail className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Related Posts */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Related Articles</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 2).map((relatedPost) => (
                    <Link
                      key={relatedPost.slug}
                      href={`/blog/${relatedPost.slug}`}
                      className="group bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
                    >
                      <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {relatedPost.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-3">{relatedPost.excerpt}</p>
                      <div className="flex items-center text-blue-600 text-sm font-medium">
                        Read more
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Back to Blog */}
          <div className="mt-8 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
