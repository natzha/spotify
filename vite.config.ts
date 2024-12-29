import { resolve } from 'path';
import { defineConfig } from 'vite';

// Configure base URL for GitHub Pages
export default defineConfig({
    base: '/spotify/', // Change 'repository-name' to your GitHub repository name

    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                login: resolve(__dirname, 'login/index.html'),
                stats: resolve(__dirname, 'stats/index.html')            }
        },

        // target from tsconfig.json, fixes npm run build issue
        target: "esnext" 
    }
});
