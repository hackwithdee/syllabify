import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Subscription {
  id: string;
  user_id: string;
  tier: 'free' | 'premium';
  roadmap_generations_used: number;
  roadmap_generations_reset_at: string;
  resources_count: number;
  created_at: string;
  updated_at: string;
}

export const FREE_LIMITS = {
  roadmapGenerationsPerMonth: 2,
  maxResources: 15,
};

export const PRICING = {
  monthly: 2500,
  yearly: 20000,
  currency: '₦',
};

export function useSubscription(userId: string | null) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSub = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    const { data } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (data) {
      setSubscription(data as unknown as Subscription);
    } else {
      const { data: created } = await supabase
        .from('user_subscriptions')
        .insert({ user_id: userId })
        .select()
        .single();
      setSubscription(created as unknown as Subscription);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchSub(); }, [fetchSub]);

  const isPremium = subscription?.tier === 'premium';

  const canGenerateRoadmap = () => {
    if (isPremium) return true;
    if (!subscription) return false;
    const resetAt = new Date(subscription.roadmap_generations_reset_at);
    if (new Date() > resetAt) return true;
    return subscription.roadmap_generations_used < FREE_LIMITS.roadmapGenerationsPerMonth;
  };

  const canAddResource = () => {
    if (isPremium) return true;
    if (!subscription) return false;
    return subscription.resources_count < FREE_LIMITS.maxResources;
  };

  const roadmapGenerationsLeft = () => {
    if (isPremium) return Infinity;
    if (!subscription) return 0;
    const resetAt = new Date(subscription.roadmap_generations_reset_at);
    if (new Date() > resetAt) return FREE_LIMITS.roadmapGenerationsPerMonth;
    return Math.max(0, FREE_LIMITS.roadmapGenerationsPerMonth - subscription.roadmap_generations_used);
  };

  const resourcesLeft = () => {
    if (isPremium) return Infinity;
    if (!subscription) return 0;
    return Math.max(0, FREE_LIMITS.maxResources - subscription.resources_count);
  };

  const incrementRoadmapGeneration = async () => {
    if (!subscription) return;
    const resetAt = new Date(subscription.roadmap_generations_reset_at);
    const now = new Date();
    if (now > resetAt) {
      await supabase.from('user_subscriptions').update({
        roadmap_generations_used: 1,
        roadmap_generations_reset_at: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString(),
      }).eq('user_id', subscription.user_id);
    } else {
      await supabase.from('user_subscriptions').update({
        roadmap_generations_used: subscription.roadmap_generations_used + 1,
      }).eq('user_id', subscription.user_id);
    }
    await fetchSub();
  };

  const incrementResourceCount = async () => {
    if (!subscription) return;
    await supabase.from('user_subscriptions').update({
      resources_count: subscription.resources_count + 1,
    }).eq('user_id', subscription.user_id);
    await fetchSub();
  };

  const decrementResourceCount = async () => {
    if (!subscription) return;
    await supabase.from('user_subscriptions').update({
      resources_count: Math.max(0, subscription.resources_count - 1),
    }).eq('user_id', subscription.user_id);
    await fetchSub();
  };

  const upgradeToPremium = async () => {
    if (!subscription) return;
    await supabase.from('user_subscriptions').update({
      tier: 'premium',
    }).eq('user_id', subscription.user_id);
    await fetchSub();
  };

  const downgradeToFree = async () => {
    if (!subscription) return;
    await supabase.from('user_subscriptions').update({
      tier: 'free',
    }).eq('user_id', subscription.user_id);
    await fetchSub();
  };

  return {
    subscription,
    loading,
    isPremium,
    canGenerateRoadmap,
    canAddResource,
    roadmapGenerationsLeft,
    resourcesLeft,
    incrementRoadmapGeneration,
    incrementResourceCount,
    decrementResourceCount,
    upgradeToPremium,
    downgradeToFree,
    refresh: fetchSub,
    FREE_LIMITS,
    PRICING,
  };
}
