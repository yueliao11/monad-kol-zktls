import { KOLProfile } from '@/types/kol';
import { getCredibilityTier } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle2, TrendingUp, Users, Shield, Copy, CopyCheck } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface KOLCardProps {
  kol: KOLProfile;
  onFollow: (kolId: string) => void;
  onUnfollow: (kolId: string) => void;
  onCopyTrade: (kolId: string) => void;
}

export function KOLCard({ kol, onFollow, onUnfollow, onCopyTrade }: KOLCardProps) {
  const tier = getCredibilityTier(kol.credibilityScore.totalScore);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={kol.avatar} alt={kol.username} />
              <AvatarFallback>{kol.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-lg">{kol.username}</h3>
                {kol.verificationStatus === 'verified' && (
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {kol.walletAddress.slice(0, 6)}...{kol.walletAddress.slice(-4)}
              </p>
            </div>
          </div>
          <Badge className={`${tier.bgColor} ${tier.color} font-medium`}>
            {tier.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{kol.bio}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              30d PnL
            </div>
            <div className="text-lg font-semibold text-green-600">
              +{kol.tradingData.pnl30d}%
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Shield className="h-3 w-3 mr-1" />
              胜率
            </div>
            <div className="text-lg font-semibold">
              {kol.tradingData.winRate}%
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              {formatNumber(kol.followersCount)} 跟随者
            </div>
            <div>
              质押: {kol.stakeAmount} VIBE
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">信誉评分</span>
            <span className="font-semibold">{kol.credibilityScore.totalScore}/100</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
              style={{ width: `${kol.credibilityScore.totalScore}%` }}
            />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Button 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            onClick={() => onCopyTrade(kol.id)}
          >
            <Copy className="h-4 w-4 mr-2" />
            跟单交易
          </Button>
          
          {kol.isFollowing ? (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onUnfollow(kol.id)}
            >
              <CopyCheck className="h-4 w-4 mr-2" />
              已跟随
            </Button>
          ) : (
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => onFollow(kol.id)}
            >
              <Users className="h-4 w-4 mr-2" />
              关注
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}