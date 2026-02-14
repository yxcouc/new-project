import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Post, Task, PostStatus } from '../types.ts';
import { POST_STATUS_CONFIG, PLATFORM_CONFIG } from '../constants.tsx';
import { ExternalLink, Calendar, Link as LinkIcon, ArrowLeft, Copy, Check } from 'lucide-react';

interface PostHistoryProps {
  posts: Post[];
  tasks: Task[];
  onStatusChange: (postId: string, status: PostStatus) => void;
}

const PostHistory: React.FC<PostHistoryProps> = ({ posts, tasks, onStatusChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const filterTaskId = searchParams.get('taskId');

  const filteredPosts = filterTaskId ? posts.filter(p => p.taskId === filterTaskId) : posts;
  const currentTask = filterTaskId ? tasks.find(t => t.id === filterTaskId) : null;

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {filterTaskId && (
        <div className="bg-blue-600 text-white p-4 rounded-3xl shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <button onClick={() => setSearchParams({})} className="p-1 hover:bg-white/20 rounded-lg"><ArrowLeft size={18}/></button>
            <h2 className="font-bold text-sm">筛选任务记录</h2>
          </div>
          <div className="bg-white/10 p-3 rounded-2xl border border-white/20">
            <p className="font-bold text-sm line-clamp-1">{currentTask?.title}</p>
            <p className="text-[10px] opacity-80 mt-1">共 {filteredPosts.length} 条记录</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filteredPosts.map(post => {
          const task = tasks.find(t => t.id === post.taskId);
          const primaryPlatform = task?.platforms[0] || 'default';
          const platformConfig = PLATFORM_CONFIG[primaryPlatform] || PLATFORM_CONFIG.default;
          const statusConfig = POST_STATUS_CONFIG[post.status];

          return (
            <div key={post.id} className="bg-white rounded-3xl border shadow-sm overflow-hidden">
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${platformConfig.color}`}>{platformConfig.icon}</div>
                    <div>
                      <h4 className="font-bold text-xs line-clamp-1">{task?.title || '未知任务'}</h4>
                      <p className="text-[10px] text-slate-400">{post.date}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${statusConfig.color}`}>
                    {statusConfig.icon} {post.status}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><LinkIcon size={10} /> 链接</span>
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => handleCopy(post.cleanUrl, post.id)}
                        className={`text-[10px] font-bold flex items-center gap-1 px-2 py-0.5 rounded-lg border ${copiedId === post.id ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-600 border-slate-200'}`}
                      >
                        {copiedId === post.id ? <><Check size={10} /> 已复制</> : <><Copy size={10} /> 复制</>}
                      </button>
                      <a href={post.cleanUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-blue-600 flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border">
                        访问 <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 break-all">{post.cleanUrl}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onStatusChange(post.id, PostStatus.COMPLETED)} className="flex-1 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-xl">通过</button>
                  <button onClick={() => onStatusChange(post.id, PostStatus.REJECTED)} className="flex-1 py-2 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-xl">退回</button>
                </div>
              </div>
            </div>
          );
        })}
        {filteredPosts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 text-sm">暂无记录</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostHistory;