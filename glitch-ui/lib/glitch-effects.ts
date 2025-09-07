// Glitch effects utility functions for cyberpunk theme

export const glitchText = (text: string, intensity: number = 0.1): string => {
  if (Math.random() > intensity) return text
  
  const glitchChars = ['!', '@', '#', '$', '%', '^', '&', '*', '~', '`', '|', '\\', '/']
  const chars = text.split('')
  
  return chars.map(char => {
    if (char === ' ') return char
    if (Math.random() < intensity) {
      return glitchChars[Math.floor(Math.random() * glitchChars.length)]
    }
    return char
  }).join('')
}

export const createGlitchAnimation = (element: HTMLElement, duration: number = 500) => {
  const originalText = element.textContent || ''
  const startTime = Date.now()
  
  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    if (progress < 1) {
      element.textContent = glitchText(originalText, 0.3 * (1 - progress))
      requestAnimationFrame(animate)
    } else {
      element.textContent = originalText
    }
  }
  
  animate()
}

export const addGlitchHover = (element: HTMLElement) => {
  const originalText = element.textContent || ''
  
  element.addEventListener('mouseenter', () => {
    element.textContent = glitchText(originalText, 0.2)
  })
  
  element.addEventListener('mouseleave', () => {
    element.textContent = originalText
  })
}

export const createScanlineEffect = (container: HTMLElement) => {
  const scanline = document.createElement('div')
  scanline.className = 'absolute inset-0 pointer-events-none'
  scanline.style.background = 'linear-gradient(transparent 50%, rgba(0, 255, 255, 0.03) 50%)'
  scanline.style.backgroundSize = '100% 4px'
  scanline.style.animation = 'scanline 2s linear infinite'
  
  container.style.position = 'relative'
  container.appendChild(scanline)
  
  // Add CSS animation if not already present
  if (!document.getElementById('scanline-animation')) {
    const style = document.createElement('style')
    style.id = 'scanline-animation'
    style.textContent = `
      @keyframes scanline {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100vh); }
      }
    `
    document.head.appendChild(style)
  }
}

export const createMatrixRain = (container: HTMLElement) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  if (!ctx) return
  
  canvas.style.position = 'absolute'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.pointerEvents = 'none'
  canvas.style.opacity = '0.1'
  
  container.style.position = 'relative'
  container.appendChild(canvas)
  
  const resizeCanvas = () => {
    canvas.width = container.offsetWidth
    canvas.height = container.offsetHeight
  }
  
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  
  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
  const charArray = chars.split('')
  const fontSize = 14
  const columns = Math.floor(canvas.width / fontSize)
  const drops: number[] = []
  
  for (let i = 0; i < columns; i++) {
    drops[i] = 1
  }
  
  const draw = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    ctx.fillStyle = '#0F0'
    ctx.font = `${fontSize}px monospace`
    
    for (let i = 0; i < drops.length; i++) {
      const text = charArray[Math.floor(Math.random() * charArray.length)]
      ctx.fillText(text, i * fontSize, drops[i] * fontSize)
      
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0
      }
      drops[i]++
    }
  }
  
  const interval = setInterval(draw, 50)
  
  return () => {
    clearInterval(interval)
    canvas.remove()
    window.removeEventListener('resize', resizeCanvas)
  }
}
