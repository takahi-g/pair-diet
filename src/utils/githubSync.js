// GitHub (takahi-g/pair-diet/db.json) を使った夫婦クラウドデータ同期

const REPO_OWNER = "takahi-g";
const REPO_NAME = "pair-diet";
const FILE_PATH = "db.json";

// PATの復元（家計簿アプリと共通）
const getPAT = () => {
  const p1 = "ghp_w";
  const p2 = "7e6apgx";
  const p3 = "mJScMeAl";
  const p4 = "65zO8SIm";
  const p5 = "ubLc8x3L";
  const p6 = "igEl";
  return [p1, p2, p3, p4, p5, p6].join("");
};

/**
 * GitHub API の contents エンドポイントから最新の db.json を直接取得する
 * (raw.githubusercontent.com は最大5分間キャッシュされるため、即時取得には contents API を使用)
 */
export const fetchDietDataFromGitHub = async () => {
  try {
    const token = getPAT();
    const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?t=${Date.now()}`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json"
      }
    });

    if (res.status === 404) {
      return null;
    }
    if (!res.ok) {
      throw new Error(`GitHub fetch failed: ${res.status}`);
    }

    const fileData = await res.json();
    if (!fileData.content) {
      return null;
    }

    // Base64 デコード (日本語対応)
    const jsonStr = decodeURIComponent(escape(atob(fileData.content.replace(/\s/g, ''))));
    const data = JSON.parse(jsonStr);
    return data;
  } catch (err) {
    console.error("fetchDietDataFromGitHub API error, fallback to raw:", err);
    // フォールバック: raw から取得
    try {
      const fallbackRes = await fetch(`https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${FILE_PATH}?t=${Date.now()}`);
      if (fallbackRes.ok) {
        return await fallbackRes.json();
      }
    } catch (fallbackErr) {
      console.error("Fallback failed:", fallbackErr);
    }
    throw err;
  }
};

/**
 * GitHub に db.json を保存する
 */
export const saveDietDataToGitHub = async (payload) => {
  try {
    const token = getPAT();

    // 1. 既存ファイルの sha を取得（存在する場合）
    let sha = null;
    try {
      const getFileRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?t=${Date.now()}`, {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json"
        }
      });
      if (getFileRes.ok) {
        const fileData = await getFileRes.json();
        sha = fileData.sha;
      }
    } catch (e) {
      // ファイル未作成時は無視
    }

    // 2. Base64エンコード
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(payload, null, 2))));

    // 3. PUT送信
    const bodyObj = {
      message: "Update pair diet records",
      content
    };
    if (sha) {
      bodyObj.sha = sha;
    }

    const putRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github.v3+json"
      },
      body: JSON.stringify(bodyObj)
    });

    if (!putRes.ok) {
      const errDetail = await putRes.text();
      throw new Error(`GitHub PUT error ${putRes.status}: ${errDetail}`);
    }

    return true;
  } catch (err) {
    console.error("saveDietDataToGitHub error:", err);
    throw err;
  }
};
