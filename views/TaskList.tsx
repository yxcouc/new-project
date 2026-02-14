import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task, TaskStatus, Post, PostStatus } from '../types.ts';
import { PLATFORM_CONFIG } from '../constants.tsx';
import { Search, ChevronRight } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  posts: Post[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, posts, onStatusChange }) => {
  const [filter, setFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredTasks = tasks.filter(t => {
    const matchesStatus = filter === 'ALL' || t.status === filter;
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.platforms.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="sticky top-16 z-30 bg-slate-50 py-2 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            placeholder="搜索任务或平台..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 ring-blue-500 outline-none text-sm"
          />
        </div>
        <div className="flex gap-2">
          {['ALL', TaskStatus.ONGOING, TaskStatus.ENDED].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                filter === s ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-500 border-slate-200'
              }`}
            >
              {s === 'ALL' ? '全部' : s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredTasks.map(task => {
          const taskPosts = posts.filter(p => p.taskId === task.id);
          const completedCount = taskPosts.filter(p => p.status === PostStatus.COMPLETED).length;
          const pendingCount = taskPosts.filter(p => p.status === PostStatus.PENDING).length;
          const completedWidth = Math.min(100, (completedCount / task.quota) * 100);
          const pendingWidth = Math.min(100 - completedWidth, (pendingCount / task.quota) * 100);

          return (
            <div 
              key={task.id} 
              onClick={() => navigate(`/history?taskId=${task.id}`)}
              className="bg-white rounded-3xl border shadow-sm overflow-hidden active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex flex-wrap gap-1.5 max-w-[80%]">
                    {task.platforms.map(p => {
                      const cfg = PLATFORM_CONFIG[p] || PLATFORM_CONFIG.default;
                      return (
                        <span key={p} className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 ${cfg.color}`}>
                          {cfg.icon} {p}
                        </span>
                      );
                    })}
                  </div>
                  <ChevronRight size={18} className="text-slate-300" />
                </div>
                <h3 className="font-bold text-sm leading-tight">{task.title}</h3>
                <div className="space-y-1.5 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100">
                  <div className="flex justify-between text-[9px] font-bold uppercase">
                    <div className="flex gap-3">
                      <span className="text-emerald-500">已通过 {completedCount}</span>
                      <span className="text-amber-500">审核中 {pendingCount}</span>
                    </div>
                    <span className="text-slate-400">{completedCount + pendingCount} / {task.quota}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-emerald-500" style={{ width: `${completedWidth}%` }}></div>
                    <div className="h-full bg-amber-400" style={{ width: `${pendingWidth}%` }}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">奖励</p>
                    <p className="text-xs font-bold text-amber-600">{task.reward}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-slate-400 font-bold uppercase">状态</p>
                    <span className={`text-[10px] font-bold ${task.status === TaskStatus.ONGOING ? 'text-emerald-500' : 'text-slate-400'}`}>
                       ● {task.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-4 py-2 flex justify-end border-t border-slate-100" onClick={e => e.stopPropagation()}>
                <button 
                  onClick={() => onStatusChange(task.id, task.status === TaskStatus.ONGOING ? TaskStatus.ENDED : TaskStatus.ONGOING)}
                  className="text-[10px] font-bold text-blue-600 uppercase"
                >
                  切换状态
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskList;