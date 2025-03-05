import { defineConfig } from 'vite';
import { CONFIG } from './config';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  root: './',
  build: {
    outDir: '../dist'
  },
  server: {
    port: 3000,
    host: CONFIG.host,
    https: {
      key: fs.readFileSync('./ssl/private.key'),
      cert: fs.readFileSync('./ssl/certificate.crt'),
      // 指定支持的 TLS 版本和密码套件
      minVersion: 'TLSv1.2',
      maxVersion: 'TLSv1.3',
      cipherSuites: [
        'TLS_AES_128_GCM_SHA256',
        'TLS_AES_256_GCM_SHA384',
        'TLS_CHACHA20_POLY1305_SHA256',
        'TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256',
        'TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256',
        'TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384',
        'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384',
        'TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256',
        'TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256'
      ],
      // 允许旧版本的 TLS
      secureOptions: 'SSL_OP_NO_SSLv3',
      honorCipherOrder: true
    },
    hmr: {
      protocol: 'wss',
      host: 'localhost',
      port: 3000
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.')
    }
  },
  optimizeDeps: {
    exclude: ['@arcgis-survey123/feature-report-components']
  }
}); 