import { defineContentScript } from '#imports';
import { t } from '@/lib/i18n';
import { fillCalendarFields } from '@/lib/gcal';
import { SELECTORS, ELEMENT_IDS, CSS_CLASSES } from '@/lib/constants';
import './style.css';

export default defineContentScript({
  matches: ['https://calendar.google.com/*'],
  main() {
    console.log('[GCal Auto Fill] Content script loaded');
    
    const observer = new MutationObserver(() => {
      const descriptionArea = document.querySelector(SELECTORS.DESCRIPTION_AREA);
      
      if (descriptionArea && !document.getElementById(ELEMENT_IDS.AUTO_FILL_BUTTON)) {
        const container = document.createElement('div');
        container.className = CSS_CLASSES.AUTO_FILL_CONTAINER;
        
        const btn = document.createElement('button');
        btn.id = ELEMENT_IDS.AUTO_FILL_BUTTON;
        btn.innerHTML = t('buttonLabel');
        btn.type = 'button';
        
        container.appendChild(btn);
        const xDescIn = document.getElementById(SELECTORS.DESCRIPTION_CONTAINER);
        if (xDescIn) {
          xDescIn.appendChild(container);
        }

        btn.onclick = () => {
          const text = (descriptionArea as HTMLElement).innerText;
          if (!text) {
            console.log(t('noTextError'));
            return;
          }
          fillCalendarFields(text);
        };
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  },
});