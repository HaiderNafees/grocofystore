'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import type { Banner } from '@/lib/types';

export interface BannerContextType {
  banners: Banner[];
  loading: boolean;
  refreshBanners: () => Promise<void>;
}

export const BannerContext = createContext<BannerContextType | undefined>(undefined);

export const BannerProvider = ({ children }: { children: ReactNode }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBanners = async (retryCount = 0) => {
    try {
      const response = await fetch('/api/banners', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch banners');
      const data = await response.json();
      setBanners(data);
      return data;
    } catch (error) {
      console.error('Error fetching banners:', error);
      
      // Retry logic for network errors
      if (retryCount < 2 && error instanceof TypeError && error.message.includes('fetch')) {
        console.log(`Retrying fetch attempt ${retryCount + 1}/3...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return fetchBanners(retryCount + 1);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
    // Set up periodic refresh to ensure data is always fresh
    const interval = setInterval(async () => {
      try {
        await fetchBanners();
      } catch (error) {
        console.error('Periodic refresh failed:', error);
      }
    }, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const value = {
    banners,
    loading,
    refreshBanners: fetchBanners,
  };

  return (
    <BannerContext.Provider value={value}>
      {children}
    </BannerContext.Provider>
  );
};
