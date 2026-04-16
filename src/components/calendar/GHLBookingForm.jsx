import { useEffect } from 'react'

export default function GHLBookingForm() {
  useEffect(() => {
    if (document.querySelector('script[src="https://go.gatewayapp.ai/js/form_embed.js"]')) return
    const script = document.createElement('script')
    script.src = 'https://go.gatewayapp.ai/js/form_embed.js'
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <div className="flex justify-center">
      <iframe
        src="https://go.gatewayapp.ai/widget/form/328qcAHH4HRmpfFaQJQy"
        style={{ width: '100%', height: '2340px', border: 'none', borderRadius: '15px' }}
        id="inline-328qcAHH4HRmpfFaQJQy"
        data-layout='{"id":"INLINE"}'
        data-trigger-type="alwaysShow"
        data-trigger-value=""
        data-activation-type="alwaysActivated"
        data-activation-value=""
        data-deactivation-type="neverDeactivate"
        data-deactivation-value=""
        data-form-name="Internal Booking"
        data-height="2340"
        data-layout-iframe-id="inline-328qcAHH4HRmpfFaQJQy"
        data-form-id="328qcAHH4HRmpfFaQJQy"
        title="Internal Booking"
      />
    </div>
  )
}
