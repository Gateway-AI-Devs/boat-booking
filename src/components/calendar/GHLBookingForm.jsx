import { useEffect, useState } from 'react'

export default function GHLBookingForm() {
  const [height, setHeight] = useState(2340)

  useEffect(() => {
    if (document.querySelector('script[src="https://go.gatewayapp.ai/js/form_embed.js"]')) return
    const script = document.createElement('script')
    script.src = 'https://go.gatewayapp.ai/js/form_embed.js'
    script.async = true
    document.body.appendChild(script)
  }, [])

  useEffect(() => {
    function onMessage(e) {
      if (e.origin !== 'https://go.gatewayapp.ai') return
      const h = e.data?.frameHeight ?? e.data?.height
      if (h && h > 100) setHeight(h)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return (
    <iframe
      src="https://go.gatewayapp.ai/widget/survey/PtCxpq58lb5Qctit3OHX"
      style={{ border: 'none', width: '100%', height: `${height}px`, display: 'block', overflow: 'hidden' }}
      scrolling="no"
      id="PtCxpq58lb5Qctit3OHX"
      title="survey"
    />
  )
}
