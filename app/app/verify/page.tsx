import { redirect } from 'next/navigation';

export default function VerifyPage() {
  // 重定向到 KOL 列表页面
  redirect('/kol');
}