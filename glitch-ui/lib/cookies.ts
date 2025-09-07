// Cookie utility functions

export function setCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return
  
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  
  const nameEQ = name + "="
  const ca = document.cookie.split(";")
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === " ") c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

export function deleteCookie(name: string) {
  if (typeof document === 'undefined') return
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

// Specific cookie getters
export function getAccessToken(): string | null {
  return getCookie("access_token")
}

export function getRefreshToken(): string | null {
  return getCookie("refresh_token")
}

export function getUserId(): string | null {
  return getCookie("user_id")
}

export function getUserName(): string | null {
  return getCookie("user_name")
}

export function getUserEmail(): string | null {
  return getCookie("user_email")
}

// Set authentication cookies
export function setAuthCookies(accessToken: string, refreshToken: string, userId: string, userDetails?: { name: string; email: string }) {
  setCookie("access_token", accessToken, 1) // 1 day
  setCookie("refresh_token", refreshToken, 7) // 7 days
  setCookie("user_id", userId, 7) // 7 days
  
  // Store user details for better persistence
  if (userDetails) {
    setCookie("user_name", userDetails.name, 7) // 7 days
    setCookie("user_email", userDetails.email, 7) // 7 days
  }
}

// Clear authentication cookies
export function clearAuthCookies() {
  deleteCookie("access_token")
  deleteCookie("refresh_token")
  deleteCookie("user_id")
  deleteCookie("user_name")
  deleteCookie("user_email")
}
