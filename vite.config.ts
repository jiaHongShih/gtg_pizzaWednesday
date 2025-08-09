import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://jiaHongShih.github.io/gtg_pizzaWednesday/
// base '/gtg_pizzaWednesday/'
export default defineConfig({
  plugins: [react()],
  base: '/gtg_pizzaWednesday/',
})
