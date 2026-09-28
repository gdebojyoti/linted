import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * There's no home page yet, so "/" opens the Library. The redirect is
   * temporary (307), because browsers never forget a permanent one: users
   * would keep skipping a landing page added later.
   */
  redirects() {
    return [{ source: "/", destination: "/resume-builder", permanent: false }];
  },
};

export default nextConfig;
