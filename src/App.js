import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  // 组件加载时获取数据
  useEffect(() => {
    fetchPosts()
  }, [])

  // 从Supabase获取所有文章
  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="container"><p>加载中...</p></div>
  }

  return (
    <div className="container">
      <header className="header">
        <h1>欢迎来到我的网站</h1>
        <p>这是我的个人创作空间</p>
      </header>

      <main className="posts">
        {posts.length === 0 ? (
          <p>暂无内容</p>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="post">
              {post.image_url && (
                <img src={post.image_url} alt={post.title} className="post-image" />
              )}
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <small>{new Date(post.created_at).toLocaleDateString()}</small>
            </article>
          ))
        )}
      </main>

      <SubmissionForm onSuccess={fetchPosts} />
    </div>
  )
}

// 表单组件 - 收集用户信息
function SubmissionForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    phone: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const { error } = await supabase
        .from('submissions')
        .insert([formData])

      if (error) throw error

      setSubmitted(true)
      setFormData({ name: '', email: '', message: '', phone: '' })
      
      // 3秒后隐藏成功提示
      setTimeout(() => setSubmitted(false), 3000)
    } catch (error) {
      setError('提交失败，请重试：' + error.message)
    }
  }

  return (
    <section className="form-section">
      <h2>联系我</h2>
      {submitted && <p className="success">感谢您的提交！</p>}
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          placeholder="您的姓名"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="您的邮箱"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="您的电话"
          value={formData.phone}
          onChange={handleChange}
        />
        <textarea
          name="message"
          placeholder="您的留言"
          value={formData.message}
          onChange={handleChange}
          rows="4"
        />
        <button type="submit" className="submit-btn">提交</button>
      </form>
    </section>
  )
}

export default App
