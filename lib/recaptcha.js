const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
const MIN_SCORE = 0.5;

export async function getRecaptchaToken(action) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey) {
    return null;
  }
  if (typeof window === 'undefined' || !window.grecaptcha?.execute) {
    throw new Error('reCAPTCHA не е заредена. Моля, презаредете страницата.');
  }
  await new Promise((resolve) => {
    window.grecaptcha.ready(resolve);
  });
  return window.grecaptcha.execute(siteKey, { action });
}

export async function verifyRecaptcha(token, expectedAction) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('RECAPTCHA_SECRET_KEY is not set; skipping verification in development');
      return true;
    }
    return false;
  }
  if (!token) {
    return false;
  }

  const response = await fetch(VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret,
      response: token,
    }),
  });
  const data = await response.json();
  if (!data.success) {
    return false;
  }
  if (typeof data.score === 'number' && data.score < MIN_SCORE) {
    return false;
  }
  if (expectedAction && data.action && data.action !== expectedAction) {
    return false;
  }
  return true;
}
