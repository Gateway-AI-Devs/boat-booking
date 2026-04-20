import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const FORMS = {
  '/enquiries/club-tickets': {
    id: 'fveuvdAWB4DwyDSXG316',
    title: 'Club Tickets & VIP Tickets',
    name: 'Enquire - Club & VIP Tickets',
    height: 1675,
  },
  '/enquiries/villas-hotel': {
    id: 'GTUnOJUeJUecOgfE9N9Q',
    title: 'Villas & Hotel',
    name: 'Enquire - Villas & Hotels',
    height: 1774,
  },
  '/enquiries/island-transfer': {
    id: 'IQBF4dxLORWsCmFC8LpS',
    title: 'Island Transfer',
    name: 'Enquire - Island Transfers',
    height: 1602,
  },
  '/enquiries/car-hire': {
    id: 'GKLgP009yHZmAbOrsSOn',
    title: 'Car Hire',
    name: 'Enquire - Car Hire',
    height: 1589,
  },
}

export default function EnquiryFormPage() {
  const { pathname } = useLocation()
  const form = FORMS[pathname]
  useEffect(() => {
    if (!document.querySelector('script[src="https://go.gatewayapp.ai/js/form_embed.js"]')) {
      const script = document.createElement('script')
      script.src = 'https://go.gatewayapp.ai/js/form_embed.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  if (!form) return null

  return (
    <div style={{ padding: '24px 28px', minHeight: '100%' }}>
      <h1
        className="text-xl font-semibold mb-6"
        style={{ color: '#2e2208', letterSpacing: '-0.01em' }}
      >
        {form.title}
      </h1>

      <div
        key={form.id}
        dangerouslySetInnerHTML={{
          __html: `<iframe
            src="https://go.gatewayapp.ai/widget/form/${form.id}"
            style="width:100%;height:${form.height}px;border:none;border-radius:8px;display:block"
            id="inline-${form.id}"
            data-layout="{'id':'INLINE'}"
            data-trigger-type="alwaysShow"
            data-trigger-value=""
            data-activation-type="alwaysActivated"
            data-activation-value=""
            data-deactivation-type="neverDeactivate"
            data-deactivation-value=""
            data-form-name="${form.name}"
            data-height="${form.height}"
            data-layout-iframe-id="inline-${form.id}"
            data-form-id="${form.id}"
            title="${form.name}"
          ></iframe>`,
        }}
      />
    </div>
  )
}
