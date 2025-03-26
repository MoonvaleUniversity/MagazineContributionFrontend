
  export const searchArt = async (
    query: string, 
    page: number
  ) => {
    // Validate environment configuration
    const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      throw new Error('Unsplash integration not configured properly');
    }
  
    try {
      // Configure API request
      const endpoint = new URL('https://api.unsplash.com/search/photos');
      const params = new URLSearchParams({
        query: query.trim(),
        page: page.toString(),
        per_page: '12',
        orientation: 'landscape',
        content_filter: 'high',
        client_id: accessKey,
      });
  
      endpoint.search = params.toString();
  
      // Execute request
      const response = await fetch(endpoint.toString(), {
        headers: {
          'Accept-Version': 'v1',
          'Authorization': `Client-ID ${accessKey}`
        }
      });
      // Handle rate limits
    if (response.status === 403 || response.status === 429) {
    
      return {
        error: `Rate limit exceeded.`,
        results: []
      };
    }
      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.join(', ') || 'API request failed');
      }
  
      // Rate limit awareness
      const rateLimit = {
        remaining: response.headers.get('X-Ratelimit-Remaining'),
        limit: response.headers.get('X-Ratelimit-Limit')
      };
  
      if (Number(rateLimit.remaining) < 10) {
        console.warn('Unsplash API rate limit approaching:', rateLimit);
      }
  
      return response.json();
      
    } catch (error) {
      console.error('Unsplash API Error:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to communicate with art search service'
      );
    }
  };
  // services/CanvasCornerService.ts
export const downloadImage = async (downloadUrl: string) => {
    const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
    
    if (!accessKey) {
      throw new Error('Unsplash access key not configured');
    }
  
    try {
      // First trigger the download count
      const response = await fetch(downloadUrl, {
        headers: {
          Authorization: `Client-ID ${accessKey}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to register download');
      }
  
      // Get actual download URL from response
      const data = await response.json();
      return data.url;
      
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  };