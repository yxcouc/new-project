
import React, { useState, useRef } from 'react';
import { X, Camera, Loader2, Check } from 'lucide-react';
import { Platform, ContentType, Task, TaskStatus } from '../types';
import { extractTaskFromImage } from '../services/geminiService';

interface TaskFormProps {
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose, onSave }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([Platform.DOUYIN]);
  const [selectedTypes, setSelectedTypes] = useState<ContentType[]>([ContentType.IMAGE_TEXT]);
  const [title, setTitle] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [quota, setQuota] = useState(1);
  const [reward, setReward] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const togglePlatform = (p: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(p) ? prev.filter(item => item !== p) : [...prev, p]
    );
  };

  const toggleType = (t: ContentType) => {
    setSelectedTypes(prev => 
      prev.includes(t) ? prev.filter(item => item !== t) : [...prev, t]
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const data = await extractTaskFromImage(base64);
      if (data) {
        setSelectedPlatforms(data.platforms || [Platform.DOUYIN]);
        setTitle(data.title || '');
        setSelectedTypes(data.types?.map((t: string) => t === '视频' ? ContentType.VIDEO : ContentType.IMAGE_TEXT) || [ContentType.IMAGE_TEXT]);
        setHashtags(data.hashtags?.join(' ') || '');
        setQuota(data.quota || 1);
        setReward(data.reward || '');
      }
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlatforms.length === 0 || selectedTypes.length === 0) return;

    onSave({
      platforms: selectedPlatforms,
      title,
      types: selectedTypes,
      hashtags: hashtags.split(/[\s,#]+/).filter(Boolean),
      quota,
      reward,
      status: TaskStatus.ONGOING
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
          <h2 className="font-bold text-lg">新增任务</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full"><X size={20}/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="w-full h-24 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1 text-slate-500 hover:border-blue-400 hover:text-blue-500 transition-colors bg-slate-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                <span className="text-xs font-medium">AI 识别中...</span>
              </>
            ) : (
              <>
                <Camera size={24} />
                <span className="text-xs font-medium">截图识别自动填充</span>
              </>
            )}
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">发布平台 (多选)</label>
            <div className="flex flex-wrap gap-2">
              {Object.values(Platform).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 border ${
                    selectedPlatforms.includes(p)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-blue-200'
                  }`}
                >
                  {selectedPlatforms.includes(p) && <Check size={12} />}
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">内容形式 (多选)</label>
            <div className="flex gap-2">
              {Object.values(ContentType).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleType(t)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1 border ${
                    selectedTypes.includes(t)
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-200'
                  }`}
                >
                  {selectedTypes.includes(t) && <Check size={12} />}
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">任务名称</label>
            <input 
              required
              placeholder="如：新品口碑传播"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-slate-100 rounded-xl focus:ring-2 ring-blue-500 outline-none border-none text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">必带话题</label>
            <input 
              placeholder="#华为 #Mate (空格分隔)"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="w-full p-3 bg-slate-100 rounded-xl focus:ring-2 ring-blue-500 outline-none border-none text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">任务数量</label>
              <input type="number" min="1" value={quota} onChange={(e) => setQuota(parseInt(e.target.value))} className="w-full p-3 bg-slate-100 rounded-xl outline-none text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">奖励标准</label>
              <input placeholder="如：50元/条" value={reward} onChange={(e) => setReward(e.target.value)} className="w-full p-3 bg-slate-100 rounded-xl outline-none text-sm" />
            </div>
          </div>

          <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-all mt-4">
            保存任务
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
