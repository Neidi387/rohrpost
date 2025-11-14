  import { init as initPlausible, track as trackPlausible, type PlausibleEventOptions } from '@plausible-analytics/tracker';

  const domain = 'mob2pc.com';
  const isProduction = location.host.includes(domain);

  const identety = navigator.userAgent;

export function useLogging(): IUseLogging {
return {
    init,
    track,
};
}

interface IUseLogging {
    init: () => Promise<void>;
    track: (eventName: string, eventData?: PlausibleEventOptions) => Promise<void>;
}

async function init() {
    if (isProduction) {
      console.log('Init Plausible');
      initPlausible({
        domain: domain
      })
  }
}

async function track(eventName: string, eventData?: PlausibleEventOptions) {
  console.log('Tracking: ' , eventName, eventData);
  if (isProduction) {
    trackPlausible(eventName, eventData!);
  } else {
    const logUrl = `${location.origin.replace(':3000','')}/log_frontend.php`;
    fetch(logUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event: eventName,
        data: eventData || null,
        id: identety,
        time: getFormattedTime(),
      })
    });
  }
}

function getFormattedTime(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(4, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${milliseconds}`;
}