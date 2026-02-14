import React from 'react';
import { Task, Post, PostStatus } from '../types.ts';
import { PLATFORM_CONFIG } from '../constants.tsx';
import { TrendingUp, CheckCircle2, AlertCircle, Banknote } from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  tasks: Task[];
  posts: Post[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, posts }) => {
  const ongoingTasks = tasks.filter(t => t.status === '进行中');
  const completedPosts = posts.filter(p => p.status === PostStatus.COMPLETED);
  const pendingPosts = posts.filter(p => p.status === PostStatus.PENDING);

  const platformStats = Object.keys(PLATFORM_CONFIG).map((platformName) => {
    if (platformName === 'default') return null;
    const count = posts.filter(p => {
      const task = tasks.find(t => t.id === p.taskId);
      return task?.platforms.includes(platformName);
    }).length;
    return { name: platformName, count };
  }).filter((s): s is { name: string; count: number } => s !== null && s.count > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-3xl border shadow-sm">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl w-fit mb-3"><TrendingUp size={20}/></div>
          <p className="text-xs font-bold text-slate-400 uppercase">进行中任务</p>
          <p className="text-2xl font-bold">{ongoingTasks.length}</p>
        </div>
        <div className="bg-white p-4 rounded-3xl border shadow-sm">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-3"><CheckCircle2 size={20}/></div>
          <p className="text-xs font-bold text-slate-400 uppercase">已通过</p>
          <p className="text-2xl font-bold">{completedPosts.length}</p>
        </div>
        <div className="bg-white p-4 rounded-3xl border shadow-sm">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl w-fit mb-3"><AlertCircle size={20}/></div>
          <p className="text-xs font-bold text-slate-400 uppercase">审核中</p>
          <p className="text-2xl font-bold">{pendingPosts.length}</p>
        </div>
        <div className="bg-white p-4 rounded-3xl border shadow-sm">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl w-fit mb-3"><Banknote size={20}/></div>
          <p className="text-xs font-bold text-slate-400 uppercase">发帖总数</p>
          <p className="text-2xl font-bold">{posts.length}</p>
        </div>
      </div>

      {platformStats.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border shadow-sm">
          <h3 className="font-bold text-xs mb-4 text-slate-400 uppercase">发帖分布</h3>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformStats}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9}} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {platformStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PLATFORM_CONFIG[entry.name]?.color.includes('black') ? '#000' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-500 uppercase">活跃任务进度</h3>
        {ongoingTasks.slice(0, 4).map(task => {
          const taskPosts = posts.filter(p => p.taskId === task.id);
          const completedCount = taskPosts.filter(p => p.status === PostStatus.COMPLETED).length;
          const pendingCount = taskPosts.filter(p => p.status === PostStatus.PENDING).length;
          const completedWidth = Math.min(100, (completedCount / task.quota) * 100);
          const pendingWidth = Math.min(100 - completedWidth, (pendingCount / task.quota) * 100);

          return (
            <div key={task.id} className="bg-white p-4 rounded-3xl border shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-bold text-xs truncate">{task.title}</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {task.platforms.map(p => (
                      <span key={p} className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">{p}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">限额 {task.quota}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[9px] font-bold uppercase">
                  <div className="flex gap-3">
                    <span className="text-emerald-500">已通过 {completedCount}</span>
                    <span className="text-amber-500">审核中 {pendingCount}</span>
                  </div>
                  <span className="text-slate-400">{Math.round(((completedCount + pendingCount) / task.quota) * 100)}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-emerald-500" style={{ width: `${completedWidth}%` }}></div>
                  <div className="h-full bg-amber-400" style={{ width: `${pendingWidth}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;