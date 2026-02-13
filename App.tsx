
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import TaskList from './views/TaskList';
import PostHistory from './views/PostHistory';
import TaskForm from './components/TaskForm';
import PostForm from './components/PostForm';
import { Task, Post, TaskStatus, PostStatus } from './types';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('social_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('social_posts');
    return saved ? JSON.parse(saved) : [];
  });

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);

  useEffect(() => {
    localStorage.setItem('social_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('social_posts', JSON.stringify(posts));
  }, [posts]);

  const addTask = (data: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    setTasks([newTask, ...tasks]);
  };

  const addPost = (data: Omit<Post, 'id' | 'createdAt'>) => {
    const newPost: Post = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    setPosts([newPost, ...posts]);
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));
  };

  const updatePostStatus = (id: string, status: PostStatus) => {
    setPosts(posts.map(p => p.id === id ? { ...p, status } : p));
  };

  return (
    <Router>
      <AppContent 
        tasks={tasks} 
        posts={posts}
        onAddTask={addTask}
        onAddPost={addPost}
        onTaskStatusChange={updateTaskStatus}
        onPostStatusChange={updatePostStatus}
        showTaskForm={showTaskForm}
        setShowTaskForm={setShowTaskForm}
        showPostForm={showPostForm}
        setShowPostForm={setShowPostForm}
      />
    </Router>
  );
};

const AppContent: React.FC<{
  tasks: Task[];
  posts: Post[];
  onAddTask: (data: Omit<Task, 'id' | 'createdAt'>) => void;
  onAddPost: (data: Omit<Post, 'id' | 'createdAt'>) => void;
  onTaskStatusChange: (id: string, status: TaskStatus) => void;
  onPostStatusChange: (id: string, status: PostStatus) => void;
  showTaskForm: boolean;
  setShowTaskForm: (show: boolean) => void;
  showPostForm: boolean;
  setShowPostForm: (show: boolean) => void;
}> = ({ 
  tasks, posts, onAddTask, onAddPost, onTaskStatusChange, onPostStatusChange,
  showTaskForm, setShowTaskForm, showPostForm, setShowPostForm 
}) => {
  const location = useLocation();

  const handleGlobalAdd = () => {
    if (location.pathname === '/history') {
      setShowPostForm(true);
    } else {
      setShowTaskForm(true);
    }
  };

  return (
    <Layout onAddClick={handleGlobalAdd}>
      <Routes>
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="/tasks" element={<TaskList tasks={tasks} posts={posts} onStatusChange={onTaskStatusChange} />} />
        <Route path="/history" element={<PostHistory posts={posts} tasks={tasks} onStatusChange={onPostStatusChange} />} />
      </Routes>

      {showTaskForm && (
        <TaskForm 
          onClose={() => setShowTaskForm(false)} 
          onSave={onAddTask} 
        />
      )}

      {showPostForm && (
        <PostForm 
          tasks={tasks}
          onClose={() => setShowPostForm(false)} 
          onSave={onAddPost} 
        />
      )}
    </Layout>
  );
};

export default App;
