import { useQuery, useQueryClient } from '@tanstack/react-query';
import { dbService } from '../services/db';

export interface InstagramTelemetry {
  followerCount: string;
  lastUpdated: string;
  status: 'online' | 'cached';
  apiHealth: 'healthy' | 'degraded';
  cacheStatus: 'synced' | 'stale';
}

const fetchPrimaryStats = async (): Promise<string> => {
  const username = 'iotclub_vitbhopal';
  const url = `https://img.shields.io/instagram/follow/${username}.json`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000); // 7s timeout
  
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const json = await res.json();
    let count = json?.message || '';
    
    // Clean up response if it contains "followers" label
    count = count.replace(/\s*followers/i, '').trim();
    
    if (!count || count === 'invalid' || count === 'inaccessible') {
      throw new Error('Shields.io scraper returned error value');
    }
    return count;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
};

const fetchBackupStats = async (): Promise<string> => {
  const username = 'iotclub_vitbhopal';
  const targetUrl = `https://www.instagram.com/${username}/`;
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout
  
  try {
    const res = await fetch(proxyUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!res.ok) throw new Error(`Proxy HTTP Error: ${res.status}`);
    const data = await res.json();
    const html = data.contents;
    
    const match = html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"/i) || 
                  html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i);
                  
    if (match && match[1]) {
      const content = match[1];
      const followersMatch = content.match(/([\d,.]+K?)\s*Followers/i) || 
                             content.match(/([\d,.]+K?)\s*followers/i);
      if (followersMatch) {
        return followersMatch[1];
      }
    }
    
    // Alt graphql parser
    const jsonMatch = html.match(/window\._sharedData\s*=\s*({.+?});/);
    if (jsonMatch) {
      const jsonData = JSON.parse(jsonMatch[1]);
      const user = jsonData.entry_data?.ProfilePage?.[0]?.graphql?.user;
      if (user?.edge_followed_by) {
        return Number(user.edge_followed_by.count).toLocaleString();
      }
    }
    
    throw new Error('Meta description tags not found in HTML response');
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
};

export const useInstagramTelemetry = () => {
  const queryClient = useQueryClient();

  // 1. Fetch cached telemetry from Firestore
  const { data: cachedTelemetry, isLoading: isCacheLoading } = useQuery<InstagramTelemetry>({
    queryKey: ['instagram_telemetry_cache'],
    queryFn: async () => {
      return await dbService.getInstagramTelemetry();
    },
    staleTime: Infinity,
  });

  // 2. Fetch live data from Instagram in the background
  const { data: liveFollowerCount, error, isFetching, refetch } = useQuery<string>({
    queryKey: ['instagram_live_stats'],
    queryFn: async () => {
      try {
        const count = await fetchPrimaryStats();
        const telemetry: InstagramTelemetry = {
          followerCount: count,
          lastUpdated: new Date().toISOString(),
          status: 'online',
          apiHealth: 'healthy',
          cacheStatus: 'synced',
        };
        await dbService.updateInstagramTelemetry(telemetry);
        queryClient.setQueryData(['instagram_telemetry_cache'], telemetry);
        return count;
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn('Primary Instagram API failed, trying backup scraper...', err);
        }
        
        try {
          const count = await fetchBackupStats();
          const telemetry: InstagramTelemetry = {
            followerCount: count,
            lastUpdated: new Date().toISOString(),
            status: 'online',
            apiHealth: 'healthy',
            cacheStatus: 'synced',
          };
          await dbService.updateInstagramTelemetry(telemetry);
          queryClient.setQueryData(['instagram_telemetry_cache'], telemetry);
          return count;
        } catch (backupErr) {
          if (import.meta.env.DEV) {
            console.error('All Instagram crawler endpoints failed. Falling back to cached stats.', backupErr);
          }
          
          if (cachedTelemetry) {
            const degradedTelemetry: InstagramTelemetry = {
              ...cachedTelemetry,
              status: 'cached',
              apiHealth: 'degraded',
              cacheStatus: 'stale',
            };
            await dbService.updateInstagramTelemetry(degradedTelemetry);
            queryClient.setQueryData(['instagram_telemetry_cache'], degradedTelemetry);
          }
          
          throw new Error('All telemetry endpoints offline');
        }
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
    refetchInterval: 1000 * 60 * 5, // Auto-update every 5 minutes in background
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attempt) => Math.min(attempt * 3000, 15000), // Linear backoff retry
  });

  return {
    followerCount: liveFollowerCount || cachedTelemetry?.followerCount || '1,250',
    lastUpdated: cachedTelemetry?.lastUpdated || new Date().toISOString(),
    status: liveFollowerCount ? 'online' : 'cached',
    apiHealth: error ? 'degraded' : 'healthy',
    cacheStatus: error ? 'stale' : 'synced',
    isLoading: isCacheLoading && isFetching,
    isRefreshing: isFetching,
    refetchLive: refetch,
  };
};
