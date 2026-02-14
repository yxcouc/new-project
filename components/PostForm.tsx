import React, { useState, useEffect } from 'react';
import { X, Copy, Link as LinkIcon, Check, Plus, Tag } from 'lucide-react';
import { Task, Post, PostStatus } from '../types.ts';
import { parseSmartLink } from '../services/geminiService.ts';

interface PostFormProps {
  tasks: Task[];
  onClose: () => void;
  onSave: (post: Omit<Post, 'id' | 'createdAt'>) => void;
}

const PostForm: React.FC<PostFormProps> = ({ tasks, onClose, onSave }) => {
  const [taskId, setTaskId] = useState('');
  const [rawText, setRawText] = useState('');
  const [cleanUrl, setCleanUrl] = useState('');
  const [manualHashtags, setManualHashtags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (tasks.length > 0 && !taskId) {
      setTaskId(tasks[0].id);
    }
  }, [tasks, taskId]);

  useEffect(() => {
    const extracted = parseSmartLink(rawText);
    setCleanUrl(extracted);
  }, [rawText]);

  const activeTask = tasks.find(t => t.id === taskId);

  const handleCopy = () => {
    if (cleanUrl) {
      navigator.clipboard.writeText(cleanUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const addManualTag = () => {
    if (newTag && !manualHashtags.includes(newTag)) {
      setManualHashtags([...manualHashtags, newTag.startsWith('#') ? newTag : `#${newTag}`]);
      setNewTag('');
    }
  };

  const removeManualTag = (tag: string) => {
    setManualHashtags(manualHashtags.filter(t => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskId || !cleanUrl) return;

    onSave({
      taskId,
      rawText,
      cleanUrl,
      status: PostStatus.PENDING,
      date: new Date().toISOString().split('T')[0],
      manualHashtags,
      notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
          <h2 className="font-bold text-lg">发帖登记</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full"><X size={20}/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">关联任务</label>
            <select 
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              className="w-full p-3 bg-slate-100 rounded-xl focus:ring-2 ring-blue-500 outline-none border-none text-sm"
            >
              {tasks.filter(t => t.status === '进行中').map(t => (
                <option key={t.id} value={t.id}>[{t.platforms.join('/')}] {t.title}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">标签管理</label>
            <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 min-h-[44px]">
              {/* Task hashtags (cannot be deleted) */}
              {activeTask?.hashtags.map((h, i) => (
                <span key={`task-${i}`} className="px-2 py-1 bg-blue-100 text-blue-600 text-[10px] font-bold rounded-lg flex items-center gap-1">
                  <Tag size={10} /> {h.startsWith('#') ? h : `#${h}`}
                </span>
              ))}
              {/* Manual hashtags (can be deleted) */}
              {manualHashtags.map((h, i) => (
                <span key={`manual-${i}`} className="px-2 py-1 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg flex items-center gap-1 group">
                  {h}
                  <button type="button" onClick={() => removeManualTag(h)} className="text-slate-400 hover:text-rose-500"><X size={10}/></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input 
                placeholder="新增手动标签..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addManualTag())}
                className="flex-1 p-2 bg-slate-100 rounded-lg outline-none text-xs"
              />
              <button type="button" onClick={addManualTag} className="p-2 bg-slate-200 rounded-lg text-slate-600 active:scale-95"><Plus size={16}/></button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">分享文案 (包含链接)</label>
            <textarea 
              required
              rows={3}
              placeholder="粘贴APP分享原始内容..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full p-3 bg-slate-100 rounded-xl focus:ring-2 ring-blue-500 outline-none border-none text-sm resize-none"
            />
          </div>

          {cleanUrl && (
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl space-y-2 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-600 flex items-center gap-1">
                  <LinkIcon size={12} /> 自动识别
                </span>
                <button type="button" onClick={handleCopy} className="text-[10px] bg-white border border-blue-200 px-2 py-0.5 rounded-lg text-blue-600 font-bold active:scale-95">
                  {copied ? '已复制' : '复制链接'}
                </button>
              </div>
              <p className="text-[10px] text-blue-800 break-all">{cleanUrl}</p>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">备注 (选填)</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-3 bg-slate-100 rounded-xl outline-none text-sm" />
          </div>

          <button type="submit" disabled={!cleanUrl} className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg active:scale-95 disabled:opacity-50 transition-all">
            完成登记
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostForm;