import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), ''); // Load all env variables regardless of VITE_ prefix
  
	return {
		plugins: [vue({
			template: {
				compilerOptions: {
					compatConfig: {
						MODE: 3
					}
				}
			}
		})],
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
				vue: '@vue/compat'
			},
			extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
		},
		css: {
			preprocessorOptions: {
				scss: {
					silenceDeprecations: ['import'],
					quietDeps: true, // Suppress warnings from dependencies
					additionalData: `$primary-color: ${env.VITE_PRIMARY_COLOR};` // Pass as Sass variable
				}
			}
		}
	}
})