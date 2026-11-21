/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { StorefrontPage } from './pages/StorefrontPage';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class AppErrorBoundary extends Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message || 'Erro inesperado.' };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0D0908] text-[#F5EFE6] flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-[#18110E] border border-[#E5A94C]/25 rounded-2xl p-8 text-center">
            <h1 className="font-display italic text-3xl font-semibold mb-2">
              Algo deu errado
            </h1>
            <p className="text-sm text-[#BFB6AA] mb-6">{this.state.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-[#C41E24] text-white text-sm font-semibold cursor-pointer"
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <AppErrorBoundary>
      <StorefrontPage />
    </AppErrorBoundary>
  );
}
