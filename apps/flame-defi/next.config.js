/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE - fixes issue when building. see: https://github.com/WalletConnect/walletconnect-monorepo/issues/4466
  webpack: config => {
    config.externals.push("pino-pretty", 'lokijs', 'encoding')
    return config
  }
};

export default nextConfig;
