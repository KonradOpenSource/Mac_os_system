export interface App {
  id: string;
  name: string;
  icon: string;
  component: string;
  isRunning: boolean;
  isOpen: boolean;
  windowId?: string;
}
