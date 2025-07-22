'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Crown, Wallet, Menu, X } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setIsConnected(true);
            setAddress(accounts[0]);
          }
        } catch (error) {
          console.error('Failed to check wallet connection:', error);
        }
      }
    };
    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsConnected(true);
        setAddress(accounts[0]);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      alert('请安装 MetaMask 钱包');
    }
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Crown className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold text-gray-900">KOL信誉链</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
              首页
            </Link>
            <Link href="/kol" className="text-gray-700 hover:text-gray-900 font-medium">
              KOL列表
            </Link>
            <Link href="/verify" className="text-gray-700 hover:text-gray-900 font-medium">
              验证中心
            </Link>
            <Link href="/docs" className="text-gray-700 hover:text-gray-900 font-medium">
              文档
            </Link>
          </div>

          {/* Wallet Connection */}
          <div className="hidden md:flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-2 text-gray-700">
                <Wallet className="h-4 w-4" />
                <span className="text-sm font-medium">{truncateAddress(address)}</span>
              </div>
            ) : (
              <Button onClick={connectWallet} variant="outline" size="sm">
                <Wallet className="h-4 w-4 mr-2" />
                连接钱包
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-700" />
              ) : (
                <Menu className="h-5 w-5 text-gray-700" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-gray-900 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                首页
              </Link>
              <Link 
                href="/kol" 
                className="text-gray-700 hover:text-gray-900 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                KOL列表
              </Link>
              <Link 
                href="/verify" 
                className="text-gray-700 hover:text-gray-900 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                验证中心
              </Link>
              <Link 
                href="/docs" 
                className="text-gray-700 hover:text-gray-900 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                文档
              </Link>
              
              {/* Mobile Wallet Connection */}
              <div className="pt-4 border-t border-gray-200">
                {isConnected ? (
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Wallet className="h-4 w-4" />
                    <span className="text-sm font-medium">{truncateAddress(address)}</span>
                  </div>
                ) : (
                  <Button onClick={connectWallet} variant="outline" size="sm" className="w-full">
                    <Wallet className="h-4 w-4 mr-2" />
                    连接钱包
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}