import React, { useEffect, useRef, useState } from 'react'

const formUrl = import.meta.env.VITE_FORM_URL as string | undefined

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])
  return isMobile
}

export default function App() {
  const isMobile = useIsMobile()
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (!videoRef.current) return
    if (isMobile) {
      // Mobile: loop & autoplay muted
      videoRef.current.muted = true
      videoRef.current.loop = true
      videoRef.current.playsInline = true
      videoRef.current.autoplay = true
      videoRef.current.play().catch(() => {})
    }
  }, [isMobile])

  const onMouseEnterVideo = () => {
    if (!isMobile && videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.play().catch(() => {})
    }
  }
  const onMouseLeaveVideo = () => {
    if (!isMobile && videoRef.current) {
      videoRef.current.pause()
    }
  }

  return (
    <div className="page">
      {/* Sticky header */}
      <header className="nav">
        <div className="nav-inner">
          <div className="brand">
            <span className="logo-dot" />
            <span className="brand-text">GrowToGather</span>
          </div>
          <div className="auth-actions">
            <button className="ghost disabled" aria-disabled title="Coming soon">Log in</button>
            <button className="primary disabled" aria-disabled title="Coming soon">Sign up</button>
          </div>
        </div>
      </header>

      <main className="container">
        {/* Hero */}
        <section className="hero fade-in-up">
          <h1 className="title">GrowToGather Networking Event</h1>
          <p className="subtitle">Connect with students and newcomers. Learn, share, and build your network.</p>
          <div className="divider" />
        </section>

        {/* Video */}
        <section className="video-card fade-in-up" aria-label="Event introduction video">
          <video
            ref={videoRef}
            className="video"
            // 用 <source> 列出多種格式，優先 mp4
            playsInline
            controls
            muted
            onMouseEnter={onMouseEnterVideo}
            onMouseLeave={onMouseLeaveVideo}
            preload="metadata"
            poster="/poster.jpg" // 可選：放一張封面在 public/poster.jpg
          >
            <source src="/intro.mp4?v=1" type="video/mp4" />
            <source src="/intro.mov" type="video/quicktime" />
            Your browser does not support the video tag.
          </video>
        </section>

        {/* CTA */}
        <section className="cta fade-in-up">
          <a
            className={`btn ${formUrl ? '' : 'btn-disabled'}`}
            href={formUrl || '#'}
            target="_blank"
            rel="noreferrer noopener"
            aria-disabled={!formUrl}
            onClick={(e) => {
              if (!formUrl) e.preventDefault()
            }}
          >
            {formUrl ? 'Register on Google Form' : 'Set VITE_FORM_URL to enable registration'}
          </a>
          <p className="microcopy">Opens Google Form in a new tab.</p>
        </section>

        {/* Footer */}
        <footer className="footer fade-in-up">
          <p>© {new Date().getFullYear()} GrowToGather • Ottawa, Canada</p>
        </footer>
      </main>
    </div>
  )
}


// import React from 'react'

// const formUrl = import.meta.env.VITE_FORM_URL as string | undefined
// const videoUrl = import.meta.env.VITE_VIDEO_URL as string | undefined

// function isYouTube(url: string) {
//   return /youtube\.com|youtu\.be/.test(url)
// }

// export default function App() {
//   return (
//     <div className="page">
//       <header className="nav">
//         <div className="brand">
//           <span className="logo-dot" /> GrowToGather
//         </div>
//       </header>

//       <main className="container">
//         <section className="hero">
//           <h1 className="title">GrowToGather Networking Event</h1>
//           <p className="subtitle">Connect with students and newcomers. Learn, share, and build your network.</p>
//         </section>

//         <section className="video-wrap" aria-label="Event introduction video">
//           {!videoUrl ? (
//             <div className="video-placeholder">
//               <p>Set <code>VITE_VIDEO_URL</code> in your environment to show the intro video.</p>
//             </div>
//           ) : isYouTube(videoUrl) ? (
//             <div className="responsive-iframe">
//               <iframe
//                 src={videoUrl.includes('embed') ? videoUrl : `https://www.youtube.com/embed/${extractYouTubeId(videoUrl)}`}
//                 title="GrowToGather — Event Intro"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//                 allowFullScreen
//               />
//             </div>
//           ) : (
//             <video className="video" src={videoUrl} controls playsInline />
//           )}
//         </section>

//         <section className="cta">
//           <a
//             className="btn"
//             href={formUrl || '#'}
//             target="_blank"
//             rel="noreferrer noopener"
//             aria-disabled={!formUrl}
//             onClick={(e) => { if (!formUrl) e.preventDefault(); }}
//           >
//             {formUrl ? 'Register on Google Form' : 'Set VITE_FORM_URL to enable registration'}
//           </a>
//         </section>

//         <footer className="footer">
//           <p>© {new Date().getFullYear()} GrowToGather • Ottawa, Canada</p>
//         </footer>
//       </main>
//     </div>
//   )
// }

// /** Extract YouTube ID from URL variations */
// function extractYouTubeId(url: string) {
//   try {
//     const u = new URL(url)
//     if (u.hostname.includes('youtu.be')) return u.pathname.slice(1)
//     if (u.searchParams.get('v')) return u.searchParams.get('v')!
//     // Fallback for /embed/:id or /v/:id
//     const parts = u.pathname.split('/').filter(Boolean)
//     return parts[parts.length - 1]
//   } catch {
//     return url
//   }
// }
