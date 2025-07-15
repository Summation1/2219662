import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLogger } from '../middleware/LoggerContext';

const Redirector = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();
  const { log } = useLogger();

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('shortened') || '[]');
    const entry = all.find((e) => e.shortcode === shortcode);
    if (!entry || new Date(entry.expiry) < new Date()) {
      alert('Link expired or invalid');
      navigate('/');
      return;
    }

    const click = {
      time: new Date().toISOString(),
      source: document.referrer || 'direct',
      location: 'Unknown',
    };

    entry.clicks.push(click);
    localStorage.setItem('shortened', JSON.stringify(all));
    log('Link clicked', { shortcode });
    window.location.href = entry.original;
  }, [shortcode]);

  return <div>Redirecting...</div>;
};

export default Redirector;
