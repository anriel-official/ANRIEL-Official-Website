// AN:RIEL CONTACT フォーム
(() => {
  "use strict";

  const form = document.getElementById("contactForm");
  const button = document.getElementById("contactSubmit");
  const result = document.getElementById("contactResult");
  if (!form || !button || !result) return;

  const endpoint = `${SUPABASE_URL}/functions/v1/submit-contact`;

  function showResult(message, success) {
    result.textContent = message;
    result.className = `contact-result ${success ? "is-success" : "is-error"}`;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity() || button.disabled) return;

    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      category: String(data.get("category") || "").trim(),
      message: String(data.get("message") || "").trim(),
      website: String(data.get("website") || ""),
      turnstileToken: String(data.get("cf-turnstile-response") || ""),
    };

    if (!payload.name || !payload.email || !payload.category || !payload.message) {
      showResult("必須項目を入力してください。", false);
      return;
    }

    if (!payload.turnstileToken) {
      showResult("ボット認証が完了していません。認証後に再度送信してください。", false);
      return;
    }

    button.disabled = true;
    button.textContent = "送信中...";
    result.className = "contact-result";
    result.textContent = "";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || body.success !== true) {
        throw new Error(typeof body.error === "string" ? body.error : "送信できませんでした。時間をおいて再度お試しください。");
      }
      form.reset();
      window.turnstile?.reset();
      showResult("お問い合わせを受け付けました。", true);
    } catch (error) {
      console.error("CONTACT送信エラー:", error);
      showResult(error instanceof Error ? error.message : "送信に失敗しました。", false);
      window.turnstile?.reset();
    } finally {
      button.disabled = false;
      button.innerHTML = '送信する <span aria-hidden="true">↗</span>';
    }
  });
})();
