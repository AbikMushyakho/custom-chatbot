/** @type {import('next').NextConfig} */
/** @type {import('dotenv').DotenvConfigOptions} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
};

module.exports = nextConfig
