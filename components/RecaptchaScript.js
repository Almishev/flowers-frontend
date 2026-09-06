import Script from "next/script";

export default function RecaptchaScript() {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!recaptchaSiteKey) return null;

  return (
    <Script
      src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
      strategy="afterInteractive"
    />
  );
}
