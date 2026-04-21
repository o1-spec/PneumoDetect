export interface DialogButton {
  text: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: () => void;
}

export interface DialogOptions {
  title: string;
  message?: string;
  buttons?: DialogButton[];
}

export interface DialogData extends DialogOptions {
  id: string;
}

let dialogCallbacks: Array<(dialog: DialogData | null) => void> = [];

export const dialogManager = {
  subscribe: (callback: (dialog: DialogData | null) => void) => {
    dialogCallbacks.push(callback);
    return () => {
      dialogCallbacks = dialogCallbacks.filter((cb) => cb !== callback);
    };
  },

  show: (options: DialogOptions) => {
    const id = Math.random().toString(36).substr(2, 9);
    const dialog: DialogData = { id, ...options };
    dialogCallbacks.forEach((callback) => callback(dialog));
    return id;
  },

  hide: () => {
    dialogCallbacks.forEach((callback) => callback(null));
  },
};
