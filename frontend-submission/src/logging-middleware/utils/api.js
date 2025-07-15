

import { BASE_URL, AUTH_TOKEN } from '../config/auth.js';

export const sendLog = async (logPayload) => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: AUTH_TOKEN,
      },
      body: JSON.stringify(logPayload),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to log');

    return result;
  } catch (error) {
    console.error('Logging error:', error.message);
  }
};
