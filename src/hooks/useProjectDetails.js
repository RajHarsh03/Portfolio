import { useState, useEffect } from 'react';
import { fetchProjectDetails } from '../services/projectDetailsGist.js';

export function useProjectDetails() {
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);

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
