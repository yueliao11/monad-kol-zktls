import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { parseEther } from 'viem';
import { KOLProfile } from '@/types/kol';

// KOL Credibility Contract ABI (simplified for demo)
const KOL_CREDIBILITY_ABI = [
  {
    "inputs": [
      { "name": "kolAddress", "type": "address" }
    ],
    "name": "followKOL",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "kolAddress", "type": "address" }
    ],
    "name": "unfollowKOL",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "user", "type": "address" },
      { "name": "kol", "type": "address" }
    ],
    "name": "isFollowing",
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "kolAddress", "type": "address" }
    ],
    "name": "getFollowerCount",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

const KOL_CREDIBILITY_ADDRESS = '0x1234567890123456789012345678901234567890'; // Mock address

interface UseKOLFollowProps {
  kolAddress: string;
}

interface FollowState {
  isFollowing: boolean;
  followerCount: number;
  isLoading: boolean;
  error: string | null;
}

export function useKOLFollow({ kolAddress }: UseKOLFollowProps) {
  const { address: userAddress } = useAccount();
  const [followState, setFollowState] = useState<FollowState>({
    isFollowing: false,
    followerCount: 0,
    isLoading: false,
    error: null
  });

  // Read current follow status
  const { data: isFollowing, refetch: refetchFollowing } = useReadContract({
    address: KOL_CREDIBILITY_ADDRESS,
    abi: KOL_CREDIBILITY_ABI,
    functionName: 'isFollowing',
    args: userAddress && kolAddress ? [userAddress, kolAddress] : undefined,
    enabled: !!userAddress && !!kolAddress
  });

  // Read follower count
  const { data: followerCount, refetch: refetchCount } = useReadContract({
    address: KOL_CREDIBILITY_ADDRESS,
    abi: KOL_CREDIBILITY_ABI,
    functionName: 'getFollowerCount',
    args: kolAddress ? [kolAddress] : undefined,
    enabled: !!kolAddress
  });

  // Write contract hooks
  const { writeContract: followKOL, isPending: isFollowingPending } = useWriteContract();
  const { writeContract: unfollowKOL, isPending: isUnfollowingPending } = useWriteContract();

  // Update local state when contract data changes
  useEffect(() => {
    setFollowState(prev => ({
      ...prev,
      isFollowing: Boolean(isFollowing),
      followerCount: followerCount ? Number(followerCount) : 0
    }));
  }, [isFollowing, followerCount]);

  const handleFollow = async () => {
    if (!userAddress || !kolAddress) {
      setFollowState(prev => ({ ...prev, error: '请先连接钱包' }));
      return;
    }

    setFollowState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await followKOL({
        address: KOL_CREDIBILITY_ADDRESS,
        abi: KOL_CREDIBILITY_ABI,
        functionName: 'followKOL',
        args: [kolAddress]
      });

      // Optimistic update
      setFollowState(prev => ({
        ...prev,
        isFollowing: true,
        followerCount: prev.followerCount + 1
      }));

      // Refresh contract data
      await Promise.all([refetchFollowing(), refetchCount()]);
    } catch (error) {
      setFollowState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : '跟随失败' 
      }));
    } finally {
      setFollowState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleUnfollow = async () => {
    if (!userAddress || !kolAddress) {
      setFollowState(prev => ({ ...prev, error: '请先连接钱包' }));
      return;
    }

    setFollowState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await unfollowKOL({
        address: KOL_CREDIBILITY_ADDRESS,
        abi: KOL_CREDIBILITY_ABI,
        functionName: 'unfollowKOL',
        args: [kolAddress]
      });

      // Optimistic update
      setFollowState(prev => ({
        ...prev,
        isFollowing: false,
        followerCount: Math.max(0, prev.followerCount - 1)
      }));

      // Refresh contract data
      await Promise.all([refetchFollowing(), refetchCount()]);
    } catch (error) {
      setFollowState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : '取消跟随失败' 
      }));
    } finally {
      setFollowState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const refreshData = async () => {
    await Promise.all([refetchFollowing(), refetchCount()]);
  };

  return {
    ...followState,
    isLoading: followState.isLoading || isFollowingPending || isUnfollowingPending,
    follow: handleFollow,
    unfollow: handleUnfollow,
    refresh: refreshData
  };
}

// Hook for managing multiple KOL follows
export function useKOLFollows(kols: KOLProfile[]) {
  const { address: userAddress } = useAccount();
  const [followStates, setFollowStates] = useState<Record<string, FollowState>>({});

  // Batch read follow statuses
  const followStatuses = useReadContract({
    address: KOL_CREDIBILITY_ADDRESS,
    abi: KOL_CREDIBILITY_ABI,
    functionName: 'getFollowStatuses',
    args: userAddress ? [userAddress, kols.map(k => k.walletAddress)] : undefined,
    enabled: !!userAddress && kols.length > 0
  });

  // Initialize states
  useEffect(() => {
    const initialStates: Record<string, FollowState> = {};
    kols.forEach(kol => {
      initialStates[kol.id] = {
        isFollowing: false,
        followerCount: kol.followersCount,
        isLoading: false,
        error: null
      };
    });
    setFollowStates(initialStates);
  }, [kols]);

  const updateFollowState = (kolId: string, updates: Partial<FollowState>) => {
    setFollowStates(prev => ({
      ...prev,
      [kolId]: { ...prev[kolId], ...updates }
    }));
  };

  const handleFollow = async (kol: KOLProfile) => {
    if (!userAddress) return;

    updateFollowState(kol.id, { isLoading: true, error: null });

    try {
      // Simulate contract interaction
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateFollowState(kol.id, {
        isFollowing: true,
        followerCount: followStates[kol.id]?.followerCount + 1 || kol.followersCount + 1,
        isLoading: false
      });
    } catch (error) {
      updateFollowState(kol.id, {
        error: '操作失败',
        isLoading: false
      });
    }
  };

  const handleUnfollow = async (kol: KOLProfile) => {
    if (!userAddress) return;

    updateFollowState(kol.id, { isLoading: true, error: null });

    try {
      // Simulate contract interaction
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateFollowState(kol.id, {
        isFollowing: false,
        followerCount: Math.max(0, followStates[kol.id]?.followerCount - 1 || kol.followersCount - 1),
        isLoading: false
      });
    } catch (error) {
      updateFollowState(kol.id, {
        error: '操作失败',
        isLoading: false
      });
    }
  };

  return {
    followStates,
    follow: handleFollow,
    unfollow: handleUnfollow
  };
}