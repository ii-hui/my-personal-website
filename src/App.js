import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('保姆')
  const [navOpen, setNavOpen] = useState(false)

  const categories = ['保姆', '育儿嫂', '老年护理', '医院护工']

  // 设置浏览器标签栏
  useEffect(() => {
    document.title = '秦皇岛港湾家政'
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link')
    link.rel = 'icon'
    link.href = '/LOGO.png'
    document.head.appendChild(link)
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [])

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

  // 按分类过滤文章
  const filteredPosts = posts.filter(post => post.category === activeCategory)

  if (loading) {
    return <div className="loading">加载中...</div>
  }

  return (
    <div className="app-wrapper">
      {/* 固定导航栏 */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <img src="/LOGO.png" alt="秦皇岛港湾家政Logo" className="navbar-logo" />
            <span className="brand-text">秦皇岛港湾家政</span>
          </div>

          {/* 汉堡菜单按钮 */}
          <button 
            className="hamburger"
            onClick={() => setNavOpen(!navOpen)}
            aria-label="菜单"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* 导航菜单 */}
          <ul className={`nav-menu ${navOpen ? 'active' : ''}`}>
            {categories.map(category => (
              <li key={category}>
                <button
                  className={`nav-link ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(category)
                    setNavOpen(false)
                  }}
                >
                  {category}
                </button>
              </li>
            ))}
            <li>
              <a href="#contact" className="nav-link">联系我们</a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero区 */}
      <header className="hero">
        <div className="hero-content">
          {/* LOGO在上方 */}
          <div className="hero-logo">
            <img src="/LOGO.png" alt="秦皇岛港湾家政 - 专业家政服务" className="hero-logo-img" />
          </div>
          <h1>专注于本地服务的高端家政</h1>
          <p>我们的联系电话是：18533552006</p>
        </div>
      </header>

      {/* 主容器 */}
      <div className="main-container">
        {/* 分类标题 */}
        <div className="category-header">
          <h2>{activeCategory}服务</h2>
          <p>为您提供专业、可靠的{activeCategory}服务</p>
        </div>

        {/* 内容区 */}
        <main className="posts-grid">
          {filteredPosts.length === 0 ? (
            <div className="empty-state">
              <p>暂无{activeCategory}相关内容</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <article key={post.id} className="post-card">
                {post.image_url && (
                  <img 
                    src={post.image_url} 
                    alt={post.image_alt || post.title} 
                    title={post.image_caption || post.title}
                    loading="lazy"
                    className="post-image" 
                  />
                )}
                <div className="post-content">
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  <small>{new Date(post.created_at).toLocaleDateString('zh-CN')}</small>
                </div>
              </article>
            ))
          )}
        </main>

        {/* 联系表单和优势卡片的两栏布局 */}
        <div className="contact-advantages-wrapper">
          {/* 左侧：联系表单 */}
          <SubmissionForm onSuccess={fetchPosts} />

          {/* 右侧：4个优势卡片 - 2x2网格 */}
          <div className="advantages-grid">
            <div className="advantage-card">
              <div className="advantage-image">
                <img src="/images/card-training.png" alt="专业培训认证" className="card-img" />
              </div>
              <h3>专业培训</h3>
              <p>所有员工均经过专业培训认证</p>
            </div>

            <div className="advantage-card">
              <div className="advantage-image">
                <img src="/images/card-screening.png" alt="严格筛选背景审查" className="card-img" />
              </div>
              <h3>严格筛选</h3>
              <p>背景审查 + 多轮面试</p>
            </div>

            <div className="advantage-card">
              <div className="advantage-image">
                <img src="/images/card-service.png" alt="24小时在线客服支持" className="card-img" />
              </div>
              <h3>24小时在线客服</h3>
              <p>随时为您解答问题</p>
            </div>

            <div className="advantage-card">
              <div className="advantage-image">
                <img src="/images/card-support.png" alt="安心保障应急支持" className="card-img" />
              </div>
              <h3>安心保障</h3>
              <p>24小时应急支持</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SubmissionForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    phone: '',
    category: '保姆'
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const categories = ['保姆', '育儿嫂', '老年护理', '医院护工']

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
      setFormData({ name: '', email: '', message: '', phone: '', category: '保姆' })
      
      setTimeout(() => setSubmitted(false), 3000)
    } catch (error) {
      setError('提交失败，请重试：' + error.message)
    }
  }

  return (
    <section id="contact" className="contact-form">
      <h2>相信我们是专业的 - 告诉我你的需求</h2>
      <p className="form-subtitle">我们将尽快为您安排最合适的服务人员</p>
      
      {submitted && <p className="success">提交完成，我们将尽快联系您！</p>}
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          placeholder="您的姓名"
          value={formData.name}
          onChange={handleChange}
          required
          aria-label="您的姓名"
        />
        
        <input
          type="tel"
          name="phone"
          placeholder="您的电话"
          value={formData.phone}
          onChange={handleChange}
          required
          aria-label="您的电话"
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="form-select"
          aria-label="服务类型"
        >
          <option value="">请选择服务类型</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <textarea
          name="message"
          placeholder="留下您的详细需求，我们将为您匹配最优质的工作人员"
          value={formData.message}
          onChange={handleChange}
          rows="5"
          aria-label="您的需求"
        />
        
        <button type="submit" className="submit-btn">提交需求</button>
      </form>
    </section>
  )
}

export default App