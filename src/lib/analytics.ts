import { site } from '../config/site';

/** F08: cookieless Plausible, only on the production host, never in dev or deploy previews. */
export function analyticsSnippet(domain = site.analytics.plausibleDomain, host = site.analytics.productionHost): string {
  if (!domain) return '';
  const guard = host ? `if(location.hostname!==${JSON.stringify(host)})return;` : '';
  return `<script>(function(){${guard}var s=document.createElement('script');s.defer=true;s.dataset.domain=${JSON.stringify(domain)};s.src='https://plausible.io/js/script.tagged-events.js';document.head.appendChild(s);window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)};})();</script>`;
}

/** Browser-side event helper; safe no-op when analytics is off. Also records events for tests. */
export const TRACK_JS = `window.tabulaTrack=function(n,p){try{(window.__tabulaEvents=window.__tabulaEvents||[]).push({n:n,p:p||{}});if(window.plausible)window.plausible(n,{props:p||{}});}catch(e){}};`;
