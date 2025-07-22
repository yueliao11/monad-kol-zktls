'use client';

import { useState, useEffect } from 'react';
import { mockKOLData } from '@/lib/mock-data';
import { KOLCard } from '@/components/kol/KOLCard';
import { KOLJoinModal } from '@/components/kol/KOLJoinModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, Plus, Search, Filter } from 'lucide-react';
import { KOLProfile } from '@/types/kol';

export default function KOLListPage() {
  const [kols, setKols] = useState<KOLProfile[]>([]);
  const [filteredKols, setFilteredKols] = useState<KOLProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [sortBy, setSortBy] = useState('score');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setKols(mockKOLData);
    setFilteredKols(mockKOLData);
  }, []);

  useEffect(() => {
    let filtered = kols.filter(kol => 
      kol.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kol.bio.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedTier !== 'all') {
      filtered = filtered.filter(kol => {
        const tier = selectedTier === 'elite' ? kol.credibilityScore.totalScore >= 90 :
                    selectedTier === 'expert' ? kol.credibilityScore.totalScore >= 80 :
                    selectedTier === 'professional' ? kol.credibilityScore.totalScore >= 70 :
                    selectedTier === 'experienced' ? kol.credibilityScore.totalScore >= 60 :
                    kol.credibilityScore.totalScore < 60;
        return tier;
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.credibilityScore.totalScore - a.credibilityScore.totalScore;
        case 'followers':
          return b.followersCount - a.followersCount;
        case 'pnl':
          return b.tradingData.pnl30d - a.tradingData.pnl30d;
        case 'volume':
          return b.tradingData.volume30d - a.tradingData.volume30d;
        default:
          return 0;
      }
    });

    setFilteredKols(filtered);
  }, [kols, searchTerm, selectedTier, sortBy]);

  const handleFollow = (kolId: string) => {
    setKols(prev => prev.map(kol => 
      kol.id === kolId ? { ...kol, isFollowing: true, followersCount: kol.followersCount + 1 } : kol
    ));
  };

  const handleUnfollow = (kolId: string) => {
    setKols(prev => prev.map(kol => 
      kol.id === kolId ? { ...kol, isFollowing: false, followersCount: kol.followersCount - 1 } : kol
    ));
  };

  const handleCopyTrade = (kolId: string) => {
    const kol = kols.find(k => k.id === kolId);
    if (kol) {
      // TODO: 实现跟单逻辑 - 可以弹出跟单配置模态框
      alert(`开始跟单 ${kol.username}！\n\n功能包括：\n- 自动复制交易信号\n- 设置跟单金额\n- 风险控制设置`);
      
      // 模拟跟单成功，增加跟单者数量
      setKols(prev => prev.map(k => 
        k.id === kolId ? { 
          ...k, 
          followersCount: k.followersCount + 1,
          isFollowing: true 
        } : k
      ));
    }
  };

  const handleJoinSuccess = (newKOL: KOLProfile) => {
    setKols(prev => [...prev, { ...newKOL, id: String(prev.length + 1) }]);
    setShowJoinModal(false);
  };

  const stats = {
    totalKOLs: kols.length,
    verifiedKOLs: kols.filter(k => k.verificationStatus === 'verified').length,
    totalStake: kols.reduce((sum, kol) => sum + kol.stakeAmount, 0),
    totalFollowers: kols.reduce((sum, kol) => sum + kol.followersCount, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Crown className="h-8 w-8 mr-2 text-purple-600" />
                KOL信誉链
              </h1>
              <p className="text-gray-600 mt-2">
                基于zkTLS验证的可信KOL列表，确保交易数据真实透明
              </p>
            </div>
            <Button 
              size="lg" 
              variant="outline"
              className="border-gray-300 text-gray-900 hover:bg-gray-50 hover:text-gray-900 bg-white"
              onClick={() => setShowJoinModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              申请成为KOL
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">总KOL数量</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalKOLs}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">已验证</p>
              <p className="text-2xl font-bold text-green-600">{stats.verifiedKOLs}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">总质押量</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalStake.toLocaleString()} VIBE</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">总跟随者</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalFollowers.toLocaleString()}</p>
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="verified">已验证</TabsTrigger>
              <TabsTrigger value="elite">精英</TabsTrigger>
              <TabsTrigger value="expert">专家</TabsTrigger>
              <TabsTrigger value="professional">专业</TabsTrigger>
              <TabsTrigger value="pending">审核中</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索KOL名称或简介..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择等级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有等级</SelectItem>
                <SelectItem value="elite">精英 (90+)</SelectItem>
                <SelectItem value="expert">专家 (80-89)</SelectItem>
                <SelectItem value="professional">专业 (70-79)</SelectItem>
                <SelectItem value="experienced">经验 (60-69)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="排序方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">按信誉评分</SelectItem>
                <SelectItem value="followers">按跟随者数</SelectItem>
                <SelectItem value="pnl">按30天收益</SelectItem>
                <SelectItem value="volume">按交易量</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKols.map(kol => (
            <KOLCard 
              key={kol.id} 
              kol={kol} 
              onFollow={handleFollow}
              onUnfollow={handleUnfollow}
              onCopyTrade={handleCopyTrade}
            />
          ))}
        </div>

        {filteredKols.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">没有找到符合条件的KOL</p>
          </div>
        )}
      </div>

      <KOLJoinModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onSuccess={handleJoinSuccess}
      />
    </div>
  );
}