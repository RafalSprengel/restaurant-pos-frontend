import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GTMPageviewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'pageview',
        page: {
          path: location.pathname + location.search,
          title: document.title,
        },
      });
    }
  }, [location]);

  return null;
};

export default GTMPageviewTracker;
