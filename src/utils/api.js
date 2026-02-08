// API utility functions for Waypoint backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'APIError';
  }
}

/**
 * Submit a product idea for analysis
 */
export async function submitAnalysis({ productIdea, tier, email }) {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_idea: productIdea,
        tier: tier,
        email: email,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        data.detail || 'Failed to submit analysis',
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Network error. Please check your connection.', 0, null);
  }
}

/**
 * Get analysis results by job ID
 */
export async function getAnalysisResults(jobId) {
  try {
    const response = await fetch(`${API_BASE_URL}/results/${jobId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        data.detail || 'Failed to fetch results',
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Network error. Please check your connection.', 0, null);
  }
}

/**
 * Poll for analysis completion
 * Calls the callback with updated data at regular intervals
 */
export async function pollAnalysisStatus(jobId, onUpdate, interval = 3000) {
  let isPolling = true;

  const poll = async () => {
    try {
      const result = await getAnalysisResults(jobId);
      
      if (onUpdate) {
        onUpdate(result);
      }

      // Stop polling if analysis is complete or failed
      if (result.data?.status === 'complete' || result.data?.status === 'failed') {
        isPolling = false;
        return;
      }

      // Continue polling
      if (isPolling) {
        setTimeout(poll, interval);
      }
    } catch (error) {
      console.error('Polling error:', error);
      if (isPolling) {
        setTimeout(poll, interval);
      }
    }
  };

  poll();

  // Return stop function
  return () => {
    isPolling = false;
  };
}

/**
 * Check API health
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
}

export { APIError };
