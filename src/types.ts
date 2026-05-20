export interface ChatSpace {
  name: string;
  type: string;
  displayName?: string;
  singleUserBotDm?: boolean;
  spaceThreadingState?: string;
}

export interface ChatMessage {
  name: string;
  sender: {
    name: string;
    displayName: string;
    avatarUrl?: string;
    type: string;
  };
  createTime: string;
  text: string;
}

export interface AuthState {
  user: {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  } | null;
  token: string | null;
  provider: string | null;
  isLoading: boolean;
}
