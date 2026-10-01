import { build } from 'vite'
import { readFile, writeFile } from 'node:fs/promises'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

const outDir = 'plugin/chathermes/dashboard/dist'
const appBuild = await build({
  configFile: false,
  base: './',
  publicDir: false,
  plugins: [vue(), tailwindcss()],
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  build: {
    outDir,
    emptyOutDir: true,
    lib: { entry: 'src/main.ts', formats: ['es'], cssFileName: 'style' },
    rollupOptions: { output: { entryFileNames: 'assets/app-[hash].js' } },
  },
})
const appOutput = Array.isArray(appBuild) ? appBuild[0] : appBuild
const appFile = appOutput?.output?.find(item => item.type === 'chunk' && item.isEntry)?.fileName
if (!appFile) throw new Error('Vue app bundle missing from plugin build')

await build({
  configFile: false,
  base: './',
  publicDir: false,
  define: { __CHATHERMES_APP_ASSET__: JSON.stringify(`./${appFile}`) },
  build: {
    outDir,
    emptyOutDir: false,
    lib: { entry: 'src/plugin-entry.ts', name: 'ChatHermesPlugin', formats: ['iife'], fileName: () => 'index.js' },
  },
})
const entry = `${outDir}/index.js`
const bundle = await readFile(entry, 'utf8')
const registered = bundle.replace('register(`chathermes`,', "register('chathermes',")
if (registered === bundle) throw new Error('Plugin registration missing from entry bundle')
await writeFile(entry, registered)
