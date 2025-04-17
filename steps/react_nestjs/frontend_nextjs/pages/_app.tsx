import React from 'react';
import '../index.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { AuthProvider } from '../contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </HelmetProvider>
  );
} 