
export enum Platform {
  DOUYIN = '抖音',
  WEIBO = '微博',
  XIAOHONGSHU = '小红书',
  VIDEO_CHANNEL = '视频号',
  HUAWEI_QIAN_KUN = '华为乾坤',
  POLLEN_CLUB = '花粉俱乐部',
  CUSTOM = '自定义'
}

export enum ContentType {
  IMAGE_TEXT = '图文',
  VIDEO = '视频'
}

export enum TaskStatus {
  ONGOING = '进行中',
  ENDED = '已结束'
}

export enum PostStatus {
  PENDING = '审核中',
  COMPLETED = '已完成',
  REJECTED = '退回'
}

export interface Task {
  id: string;
  platforms: string[]; // Changed from platform: string
  title: string;
  types: ContentType[]; // Changed from type: ContentType
  hashtags: string[];
  quota: number;
  reward: string;
  status: TaskStatus;
  createdAt: number;
}

export interface Post {
  id: string;
  taskId: string;
  rawText: string;
  cleanUrl: string;
  status: PostStatus;
  date: string;
  manualHashtags: string[]; // New field for user-added tags
  notes?: string;
  createdAt: number;
}
