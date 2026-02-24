import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/game": {
        target: "http://localhost:3001",
        secure: false,
      },
      "/api/game/logIn": {
        target: "http://localhost:3001",
        secure: false,
      },
      "/api/game/logOut": {
        target: "http://localhost:3001",
        secure: false,
      },
      "/api/game/startGame": {
        target: "http://localhost:3001",
        secure: false,
      },
      "/api/game/oneRound": {
        target: "http://localhost:3001",
        secure: false,
      },
      "/api/game/result": {
        target: "http://localhost:3001",
        secure: false,
      },
      "/api/game/profile": {
        target: "http://localhost:3001",
        secure: false,
      },
    },
  },
});
