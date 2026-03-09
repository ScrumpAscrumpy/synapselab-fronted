import { appConfig } from "../constants/appConfig.js";

let cachedApp = null;
let authPromise = null;
let sdkPromise = null;

async function getCloudbaseSdk() {
  if (!sdkPromise) {
    sdkPromise = import("@cloudbase/js-sdk");
  }

  const module = await sdkPromise;
  return module.default;
}

async function ensureAnonymousAuth(app) {
  if (authPromise) {
    return authPromise;
  }

  authPromise = (async () => {
    const auth = app.auth({ persistence: "local" });

    try {
      const loginState = await auth.getLoginState();
      if (loginState) {
        return loginState;
      }
    } catch (error) {
      // Continue to anonymous sign-in attempt.
    }

    try {
      return await auth.signInAnonymously();
    } catch (error) {
      const message = error?.message || "未知错误";
      throw new Error(`CloudBase 匿名登录失败：${message}`);
    }
  })();

  return authPromise;
}

export async function getCloudbaseApp() {
  if (cachedApp) {
    await ensureAnonymousAuth(cachedApp);
    return cachedApp;
  }

  if (!appConfig.cloudbaseEnvId) {
    throw new Error("未配置 VITE_CLOUDBASE_ENV_ID，暂时不能初始化 CloudBase。");
  }

  const cloudbase = await getCloudbaseSdk();
  cachedApp = cloudbase.init({
    env: appConfig.cloudbaseEnvId,
  });

  await ensureAnonymousAuth(cachedApp);
  return cachedApp;
}
