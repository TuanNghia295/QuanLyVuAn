import {create} from 'zustand';

type ModalState = {
  visible: boolean;
  message: string;
  onClose?: () => void;
  showModal: (msg: string, onClose?: () => void) => void;
  hideModal: () => void;
};

export const useModalStore = create<ModalState>(set => ({
  visible: false,
  message: '',
  onClose: undefined,
  showModal: (msg, onClose) => set({visible: true, message: msg, onClose}),
  hideModal: () =>
    set(state => {
      // gọi callback nếu có
      state.onClose?.();
      return {visible: false, message: '', onClose: undefined};
    }),
}));
