import { useState, useEffect } from 'react';
import { fetchProjectDetails, getCachedProjectDetails } from '../services/projectDetailsGist.js';

export function useProjectDetails() {
  const [cached] = useState(getCachedProjectDetails);
  const [details, setDetails] = useState(cached ?? {});
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    fetchProjectDetails()
      .then(data => {
        setDetails(data);
        setLoading(false);
      })
      .catch(() => {
        setDetails({});
        setLoading(false);
      });
  }, []);

  return { details, loading };
}
