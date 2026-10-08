/**
 * Wellinovate Analytics & Telemetry Engine (GA4 Ready)
 * 
 * To activate Google Analytics 4:
 * 1. Set your Measurement ID in the meta tag in <head>:
 *    <meta name="google-analytics-id" content="G-XXXXXXXXXX">
 *    OR define window.GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
 * 
 * 2. When active, it automatically captures:
 *    - Page views
 *    - Outbound clicks (e.g. welliRecord.com, LinkedIn, X)
 *    - Clinical Simulator interactions
 *    - Contact form submissions
 */

(function initAnalytics() {
  const metaTag = document.querySelector('meta[name="google-analytics-id"]');
  const metaId = metaTag ? metaTag.getAttribute('content')?.trim() : '';
  const GA_ID = window.GA_MEASUREMENT_ID || metaId || '';

  // Standby mode if ID is empty or placeholder
  if (!GA_ID || GA_ID === 'G-XXXXXXXXXX' || !/^G-[A-Za-z0-9]+$/.test(GA_ID)) {
    // Expose a safe no-op gtag helper so custom tracking calls won't fail
    window.gtag = window.gtag || function() {};
    return;
  }

  // Load gtag.js asynchronously
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_ID, {
    page_path: window.location.pathname,
    transport_type: 'beacon'
  });

  // Track key conversion events
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button');
    if (!target) return;

    // Outbound link tracking
    if (target.tagName === 'A' && target.href) {
      if (target.href.includes('wellirecord.com')) {
        gtag('event', 'click_wellirecord', {
          event_category: 'outbound',
          event_label: 'Flagship Platform Visit',
          destination: target.href
        });
      } else if (target.href.includes('linkedin.com')) {
        gtag('event', 'click_social_linkedin', {
          event_category: 'social',
          destination: target.href
        });
      } else if (target.href.includes('x.com')) {
        gtag('event', 'click_social_x', {
          event_category: 'social',
          destination: target.href
        });
      }
    }

    // Simulator launch tracking
    if (target.getAttribute('data-action') === 'open-simulator') {
      gtag('event', 'launch_simulator', {
        event_category: 'engagement',
        event_label: 'Clinical Console Simulator'
      });
    }
  });

  // Track contact form submission
  document.addEventListener('submit', (e) => {
    if (e.target && e.target.id === 'contact-form') {
      gtag('event', 'generate_lead', {
        event_category: 'contact',
        event_label: 'Contact Form Transmission'
      });
    }
  });
})();
