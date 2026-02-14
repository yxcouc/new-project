import React from 'react';
import { 
  Instagram, 
  Video, 
  MessageCircle, 
  Smartphone, 
  Globe, 
  Layout, 
  CheckCircle, 
  Clock, 
  XCircle 
} from 'lucide-react';
import { Platform, PostStatus } from './types.ts';

export const PLATFORM_CONFIG: Record<string, { color: string; icon: React.ReactNode }> = {
  [Platform.DOUYIN]: { color: 'bg-black text-white', icon: <Video size={16} /> },
  [Platform.WEIBO]: { color: 'bg-red-500 text-white', icon: <MessageCircle size={16} /> },
  [Platform.XIAOHONGSHU]: { color: 'bg-red-600 text-white', icon: <Instagram size={16} /> },
  [Platform.VIDEO_CHANNEL]: { color: 'bg-green-500 text-white', icon: <Video size={16} /> },
  [Platform.HUAWEI_QIAN_KUN]: { color: 'bg-blue-600 text-white', icon: <Smartphone size={16} /> },
  [Platform.POLLEN_CLUB]: { color: 'bg-orange-500 text-white', icon: <Globe size={16} /> },
  'default': { color: 'bg-slate-400 text-white', icon: <Layout size={16} /> }
};

export const POST_STATUS_CONFIG: Record<PostStatus, { color: string; icon: React.ReactNode }> = {
  [PostStatus.PENDING]: { color: 'text-amber-600 bg-amber-50', icon: <Clock size={14} /> },
  [PostStatus.COMPLETED]: { color: 'text-emerald-600 bg-emerald-50', icon: <CheckCircle size={14} /> },
  [PostStatus.REJECTED]: { color: 'text-rose-600 bg-rose-50', icon: <XCircle size={14} /> },
};