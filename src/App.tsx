import React, { useEffect, useMemo, useRef, useState } from 'react'

const formUrl = import.meta.env.VITE_FORM_URL as string | undefined
const videoUrl = import.meta.env.VITE_VIDEO_URL as string | undefined

function isYouTube(url: string) {
  return /youtube\.com|youtu\.be/.test(url)
}

function extractYouTubeId(url: string) {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1)
    if (u.searchParams.get('v')) return u.searchParams.get('v')!
    const parts = u.pathname.split('/').filter(Boolean)
    return parts[parts.length - 1]
  } catch {
    return url
  }
}

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
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
  const youTube = videoUrl && isYouTube(videoUrl)
  const ytId = useMemo(() => (videoUrl && youTube ? extractYouTubeId(videoUrl) : undefined), [videoUrl, youTube])

  const mp4Ref = useRef<HTMLVideoElement | null>(null)
  useEffect(() => {
    if (!mp4Ref.current) return
    if (isMobile) {
      mp4Ref.current.muted = true
      mp4Ref.current.loop = true
      mp4Ref.current.playsInline = true
      mp4Ref.current.autoplay = true
      mp4Ref.current.play().catch(() => {})
    }
  }, [isMobile, videoUrl])

  const onMouseEnterVideo = () => {
    if (isMobile) return
    if (mp4Ref.current) {
      mp4Ref.current.muted = true
      mp4Ref.current.play().catch(() => {})
    }
  }
  const onMouseLeaveVideo = () => {
    if (isMobile) return
    mp4Ref.current?.pause()
  }

  const youTubeSrc = useMemo(() => {
    if (!ytId) return undefined
    const base = `https://www.youtube.com/embed/${ytId}`
    const common = `?rel=0&modestbranding=1&playsinline=1&mute=1`
    if (isMobile) return `${base}${common}&autoplay=1&loop=1&playlist=${ytId}`
    return `${base}${common}`
  }, [ytId, isMobile])

  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [iframeSrc, setIframeSrc] = useState<string | undefined>(youTubeSrc)
  useEffect(() => setIframeSrc(youTubeSrc), [youTubeSrc])

  const onMouseEnterIframe = () => {
    if (isMobile || !youTube || !ytId) return
    const base = `https://www.youtube.com/embed/${ytId}`
    const params = `?rel=0&modestbranding=1&playsinline=1&mute=1&autoplay=1`
    setIframeSrc(`${base}${params}`)
  }
  const onMouseLeaveIframe = () => {
    if (isMobile || !youTube || !ytId) return
    const base = `https://www.youtube.com/embed/${ytId}`
    const params = `?rel=0&modestbranding=1&playsinline=1&mute=1`
    setIframeSrc(`${base}${params}`)
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
        <section
          className={`${isMobile ? 'video-full' : 'video-card'} fade-in-up`}
          aria-label="Event introduction video"
        >
          {!videoUrl ? (
            <div className="video-placeholder">
              <p>Set <code>VITE_VIDEO_URL</code> in your environment to show the intro video.</p>
            </div>
          ) : youTube ? (
            <div
              className={isMobile ? 'iframe-full' : 'responsive-iframe'}
              onMouseEnter={onMouseEnterIframe}
              onMouseLeave={onMouseLeaveIframe}
            >
              <iframe
                ref={iframeRef}
                src={iframeSrc}
                title="GrowToGather — Event Intro"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <video
              ref={mp4Ref}
              className={isMobile ? 'video-abs' : 'video'}
              src={videoUrl}
              controls={!isMobile}
              playsInline
              muted
              onMouseEnter={onMouseEnterVideo}
              onMouseLeave={onMouseLeaveVideo}
            />
          )}
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
