import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      "bubbleless-preacid-junita.ngrok-free.dev"
    ]
  }
})

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from "@tailwindcss/vite";
// import fs from 'fs'
// import path from 'path'

// // Paths to your self-signed certs (create them if you haven't)
// const certPath = path.resolve(__dirname, 'certs/localhost.pem')
// const keyPath = path.resolve(__dirname, 'certs/localhost-key.pem')

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     https: {
//       key: fs.readFileSync(keyPath),
//       cert: fs.readFileSync(certPath),
//     },
//     port: 5173,
//     allowedHosts: [
//       "bubbleless-preacid-junita.ngrok-free.dev",
//       "localhost",
//       "127.0.0.1"
//     ]
//   }
// })