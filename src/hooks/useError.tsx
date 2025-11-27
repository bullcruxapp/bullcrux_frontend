"use client";

import { create } from "zustand";

interface ErrorState {
    error: string | null;
    setError: (error: string | null) => void;
}

export const useError = create<ErrorState>((set) => ({
    error: null,
    setError: (error: string | null) => set({ error }),
}));