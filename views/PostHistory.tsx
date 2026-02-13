
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Post, Task, PostStatus } from '../types';
import { POST_STATUS_CONFIG, PLATFORM_CONFIG } from '../constants';
import { ExternalLink, Calendar, Link as LinkIcon, Tag, ArrowLeft, Copy, Check } from 'lucide-react';

interface PostHistoryProps {
  posts: Post[];
  tasks: Task[];
  onStatusChange: (postId: string, status: PostStatus) => void;
}

const PostHistory: React.FC<PostHistoryProps> = ({ posts, tasks, onStatusChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const filterTaskId = searchParams.get('taskId');

  const filteredPosts = filterTaskId 
    ? posts.filter(p => p.taskId === filterTaskId)
    : posts;

  const currentTask = filterTaskId ? tasks.find(t => t.id === filterTaskId) : null;

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {filterTaskId && (
        <div className="bg-blue-600 text-white p-4 rounded-3xl shadow-lg animate-in slide-in-from-top duration-300">
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
          // For multi-platform tasks, we use the first platform's config as default in history
          const primaryPlatform = task?.platforms[0] || 'default';
          const platformConfig = PLATFORM_CONFIG[primaryPlatform] || PLATFORM_CONFIG.default;
          const statusConfig = POST_STATUS_CONFIG[post.status];

          return (
            <div key={post.id} className="bg-white rounded-3xl border shadow-sm overflow-hidden">
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${platformConfig.color}`}>
                      {platformConfig.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs line-clamp-1">{task?.title || '未知任务'}</h4>
                      <p className="text-[10px] text-slate-400">{post.date}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${statusConfig.color}`}>
                    {statusConfig.icon}
                    {post.status}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {task?.hashtags.map((h, i) => (
                    <span key={`t-${i}`} className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                      {h.startsWith('#') ? h : `#${h}`}
                    </span>
                  ))}
                  {post.manualHashtags?.map((h, i) => (
                    <span key={`m-${i}`} className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {h}
                    </span>
                  ))}
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <LinkIcon size={10} /> 链接
                    </span>
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => handleCopy(post.cleanUrl, post.id)}
                        className={`text-[10px] font-bold flex items-center gap-1 px-2 py-0.5 rounded-lg border shadow-sm transition-all active:scale-95 ${
                          copiedId === post.id 
                            ? 'bg-emerald-500 text-white border-emerald-500' 
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        {copiedId === post.id ? (
                          <><Check size={10} /> 已复制</>
                        ) : (
                          <><Copy size={10} /> 复制</>
                        )}
                      </button>
                      <a 
                        href={post.cleanUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[10px] font-bold text-blue-600 flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border shadow-sm active:scale-95"
                      >
                        访问 <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 break-all italic">{post.cleanUrl}</p>
                </div>

                {post.notes && (
                  <div className="text-[10px] text-slate-500 px-1 italic">
                    <span className="font-bold text-slate-400">备注:</span> {post.notes}
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button 
                    onClick={() => onStatusChange(post.id, PostStatus.COMPLETED)}
                    className="flex-1 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-xl active:scale-95"
                  >
                    通过
                  </button>
                  <button 
                    onClick={() => onStatusChange(post.id, PostStatus.REJECTED)}
                    className="flex-1 py-2 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-xl active:scale-95"
                  >
                    退回
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredPosts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="mb-4 text-slate-200 flex justify-center"><Calendar size={48}/></div>
            <p className="text-slate-400 text-sm">暂无登记记录</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostHistory;
