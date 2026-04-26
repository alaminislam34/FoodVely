import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jwplayer.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;

// ## Error Type
// Runtime Error

// ## Error Message
// Invalid src prop (https://res.cloudinary.com/di2upxall/image/upload/v1777161530/foods/njlbgbk024vy26ogro7g.png) on `next/image`, hostname "res.cloudinary.com" is not configured under images in your `next.config.js`
// See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host

//     at defaultLoader (file:///home/alaminislam/Al Amin/Project/FoodVely/.next/dev/static/chunks/node_modules__pnpm_87ca0b09._.js:3547:49)
//     at <unknown> (file:///home/alaminislam/Al Amin/Project/FoodVely/.next/dev/static/chunks/node_modules__pnpm_87ca0b09._.js:992:39)
//     at Array.map (<anonymous>:null:null)
//     at generateImgAttrs (file:///home/alaminislam/Al Amin/Project/FoodVely/.next/dev/static/chunks/node_modules__pnpm_87ca0b09._.js:992:24)
//     at getImgProps (file:///home/alaminislam/Al Amin/Project/FoodVely/.next/dev/static/chunks/node_modules__pnpm_87ca0b09._.js:1405:27)
//     at <unknown> (file:///home/alaminislam/Al Amin/Project/FoodVely/.next/dev/static/chunks/node_modules__pnpm_87ca0b09._.js:3885:82)
//     at Object.react_stack_bottom_frame (file:///home/alaminislam/Al Amin/Project/FoodVely/.next/dev/static/chunks/adf63_next_dist_compiled_react-dom_67d27770._.js:14826:24)
//     at renderWithHooks (file:///home/alaminislam/Al Amin/Project/FoodVely/.next/dev/static/chunks/adf63_next_dist_compiled_react-dom_67d27770._.js:4651:24)
//     at updateForwardRef (file:///home/alaminislam/Al Amin/Project/FoodVely/.next/dev/static/chunks/adf63_next_dist_compiled_react-dom_67d27770._.js:5939:21)
//     at beginWork (file:///home/alaminislam/Al Amin/Project/FoodVely/.next/dev/static/chunks/adf63_next_dist_compiled_react-dom_67d27770._.js:6783:24)
//     at runWithFiberInDEV (file:///home/alaminislam/Al Amin/Project/FoodVely/.next/dev/static/chunks/adf63_next_dist_compiled_react-dom_67d27770._.js:965:74)
//     at performUnitOfWork (file:///home/alaminislam/Al Amin/Project/FoodVely/.next/dev/static/chunks/adf63_next_dist_compiled_react-dom_67d27770._.js:9562:97)
//     at workLoopSync (file:///home/alaminislam/Al Amin/Project/FoodVely/.next/dev/static/chunks/adf63_next_dist_compiled_react-dom_67d27770._.js:9456:40)
//     at renderRootSync (file:///home/alaminislam/Al Amin/Project/FoodVely/.next/dev/static/chunks/adf63_next_dist_compiled_react-dom_67d27770._.js:9440:13)
//     at performWorkOnRoot (file:///home/alaminislam/Al Amin/Project/FoodVely/.next/dev/static/chunks/adf63_next_dist_compiled_react-dom_67d27770._.js:9105:47)
//     at performWorkOnRootViaSchedulerTask (file:///home/alaminislam/Al Amin/Project/FoodVely/.next/dev/static/chunks/adf63_next_dist_compiled_react-dom_67d27770._.js:10230:9)
//     at MessagePort.performWorkUntilDeadline (file:///home/alaminislam/Al Amin/Project/FoodVely/.next/dev/static/chunks/adf63_next_dist_compiled_8e705ba6._.js:2647:64)
//     at <unknown> (file:///home/alaminislam/Al Amin/Project/FoodVely/.next/dev/static/chunks/src_a00a9d6d._.js:775:422)
//     at Array.map (<anonymous>:null:null)
//     at CategoriesPage (file:///home/alaminislam/Al Amin/Project/FoodVely/.next/dev/static/chunks/src_a00a9d6d._.js:748:50)
//     at ClientPageRoot (file:///home/alaminislam/Al Amin/Project/FoodVely/.next/dev/static/chunks/adf63_next_dist_22d1f17f._.js:2403:50)

// Next.js version: 16.1.5 (Turbopack)
