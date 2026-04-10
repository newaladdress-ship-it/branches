export function initializeAntiCopy() {
  // Disable right-click
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    return false
  })

  // Disable keyboard shortcuts for developer tools and copy
  document.addEventListener('keydown', (e) => {
    // Ctrl+U (View Page Source)
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault()
      return false
    }
    
    // Ctrl+Shift+I (Developer Tools)
    if (e.ctrlKey && e.shiftKey && e.key === 'i') {
      e.preventDefault()
      return false
    }
    
    // Ctrl+Shift+C (Inspect Element)
    if (e.ctrlKey && e.shiftKey && e.key === 'c') {
      e.preventDefault()
      return false
    }
    
    // F12 (Developer Tools)
    if (e.key === 'F12') {
      e.preventDefault()
      return false
    }

    // Ctrl+Shift+J (Developer Console)
    if (e.ctrlKey && e.shiftKey && e.key === 'j') {
      e.preventDefault()
      return false
    }
  })

  // Disable text selection on certain elements
  document.addEventListener('selectstart', (e) => {
    const target = e.target as HTMLElement
    if (target.classList.contains('no-select')) {
      e.preventDefault()
    }
  })

  // Disable copy
  document.addEventListener('copy', (e) => {
    const target = e.target as HTMLElement
    if (target.classList.contains('no-copy')) {
      e.preventDefault()
      alert('This content is protected and cannot be copied.')
    }
  })

  // Show alert on dev tools open attempt
  let devToolsOpen = false
  const threshold = 160

  setInterval(() => {
    if (window.outerHeight - window.innerHeight > threshold || 
        window.outerWidth - window.innerWidth > threshold) {
      if (!devToolsOpen) {
        devToolsOpen = true
        alert('Developer tools are not allowed on this website.')
      }
    } else {
      devToolsOpen = false
    }
  }, 500)
}
