/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  experimental :{
    appDir : true
  },
  env : {
    VITE_API_URL : process.env.VITE_API_URL,
    VITE_SOCKET_URL : process.env.VITE_SOCKET_URL
  }
  // images: {
  //   domains: [
  //     "https://cdn.jsdelivr.net"
  //   ],
  //   path: 'https://cdn.jsdelivr.net/_next/image',
  // },
}
