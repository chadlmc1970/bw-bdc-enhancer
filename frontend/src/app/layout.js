import './globals.css'

export const metadata = {
  title: 'BW-BDC AI Enhancement Platform',
  description: 'AI-powered semantic enhancement for SAP BW to Business Data Cloud',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
