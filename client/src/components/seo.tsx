import { useEffect } from "react"

interface SEOProps {
  title: string
  description: string
  ogImage?: string
  keywords?: string
}

export function SEO({ title, description, ogImage, keywords }: SEOProps) {
  useEffect(() => {
    document.title = `${title} | PGMA`
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = description
      document.head.appendChild(meta)
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (keywords) {
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords)
      } else {
        const meta = document.createElement('meta')
        meta.name = 'keywords'
        meta.content = keywords
        document.head.appendChild(meta)
      }
    }

    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', title)
    } else {
      const meta = document.createElement('meta')
      meta.setAttribute('property', 'og:title')
      meta.content = title
      document.head.appendChild(meta)
    }

    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) {
      ogDescription.setAttribute('content', description)
    } else {
      const meta = document.createElement('meta')
      meta.setAttribute('property', 'og:description')
      meta.content = description
      document.head.appendChild(meta)
    }

    if (ogImage) {
      const ogImageMeta = document.querySelector('meta[property="og:image"]')
      if (ogImageMeta) {
        ogImageMeta.setAttribute('content', ogImage)
      } else {
        const meta = document.createElement('meta')
        meta.setAttribute('property', 'og:image')
        meta.content = ogImage
        document.head.appendChild(meta)
      }
    }

    const twitterCard = document.querySelector('meta[name="twitter:card"]')
    if (!twitterCard) {
      const meta = document.createElement('meta')
      meta.name = 'twitter:card'
      meta.content = 'summary_large_image'
      document.head.appendChild(meta)
    }
  }, [title, description, ogImage, keywords])

  return null
}
