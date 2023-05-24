export interface NotificationResponse {
  total: number;
  pageSize: number;
  from: number;
  totalPages: number;
  results: NotificationType[];
  unreadCount: number;
}

export interface NotificationType {
  id: string;
  summary: string;
  createdDateTime: string;
  description: string;
  type: string;
  isRead: boolean;
  sortingId?: number;
  category?: string;
  updatedDateTime?: string;
  showClearButton?: boolean;
}
