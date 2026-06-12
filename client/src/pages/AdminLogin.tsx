import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Lock, Mail, Eye, EyeOff, ArrowLeft, KeyRound } from "lucide-react";
import { Link } from "wouter";

type Mode = "login" | "setup" | "change";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check if any password has been configured
  const { data: hasPassword, isLoading: checkingPw } = trpc.auth.hasPassword.useQuery();
  const utils = trpc.useUtils();

  const loginMut = trpc.auth.emailLogin.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      navigate("/admin");
    },
    onError: (e) => setError(e.message),
  });

  const setPwMut = trpc.auth.setPassword.useMutation({
    onSuccess: () => {
      setSuccess("密碼設定成功！請用新密碼登入。");
      setMode("login");
      setPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
      setError("");
    },
    onError: (e) => setError(e.message),
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("請填寫電郵與密碼"); return; }
    loginMut.mutate({ email, password });
  };

  const handleSetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) { setError("請填寫電郵地址"); return; }
    if (password.length < 8) { setError("密碼至少需要 8 個字元"); return; }
    if (password !== confirmPassword) { setError("兩次輸入的密碼不一致"); return; }
    setPwMut.mutate({
      email,
      password,
      currentPassword: mode === "change" ? currentPassword : undefined,
    });
  };

  if (checkingPw) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-label animate-pulse tracking-widest">載入中⋯</div>
      </div>
    );
  }

  // First-time setup: no password set yet
  const isFirstTime = !hasPassword;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="max-w-sm w-full space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <Lock size={26} className="mx-auto text-muted-foreground" strokeWidth={1.5} />
          <h1 className="font-serif text-2xl font-light tracking-wide">
            {isFirstTime ? "設定管理員密碼" : mode === "change" ? "更改密碼" : "後台登入"}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {isFirstTime
              ? "首次使用，請先設定你的電郵與密碼"
              : mode === "change"
              ? "輸入目前密碼與新密碼"
              : "In-Between Days 後台管理"}
          </p>
        </div>

        <div className="divider mx-auto max-w-[60px]" />

        {/* Success message */}
        {success && (
          <div className="bg-secondary/60 border border-border rounded-sm px-4 py-3 text-sm text-foreground text-center">
            {success}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-sm px-4 py-3 text-sm text-red-700 text-center">
            {error}
          </div>
        )}

        {/* ── Login Form ── */}
        {!isFirstTime && mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-label block">電郵地址</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-9 pr-4 py-2.5 border border-border bg-background text-sm focus:outline-none focus:border-foreground/40 transition-colors rounded-sm"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-label block">密碼</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 border border-border bg-background text-sm focus:outline-none focus:border-foreground/40 transition-colors rounded-sm"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMut.isPending}
              className="btn-filled w-full flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loginMut.isPending ? "登入中⋯" : "登入後台"}
            </button>

            <button
              type="button"
              onClick={() => { setMode("change"); setError(""); setSuccess(""); }}
              className="w-full text-center text-label hover:text-foreground transition-colors text-xs flex items-center justify-center gap-1.5"
            >
              <KeyRound size={11} />
              更改密碼
            </button>
          </form>
        )}

        {/* ── First-time Setup / Change Password Form ── */}
        {(isFirstTime || mode === "change") && (
          <form onSubmit={handleSetPassword} className="space-y-4">
            <div className="space-y-1">
              <label className="text-label block">電郵地址</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-9 pr-4 py-2.5 border border-border bg-background text-sm focus:outline-none focus:border-foreground/40 transition-colors rounded-sm"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {mode === "change" && (
              <div className="space-y-1">
                <label className="text-label block">目前密碼</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPw ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 border border-border bg-background text-sm focus:outline-none focus:border-foreground/40 transition-colors rounded-sm"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-label block">
                {mode === "change" ? "新密碼" : "設定密碼"}
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少 8 個字元"
                  className="w-full pl-9 pr-10 py-2.5 border border-border bg-background text-sm focus:outline-none focus:border-foreground/40 transition-colors rounded-sm"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-label block">確認密碼</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPw ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次輸入密碼"
                  className="w-full pl-9 pr-4 py-2.5 border border-border bg-background text-sm focus:outline-none focus:border-foreground/40 transition-colors rounded-sm"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={setPwMut.isPending}
              className="btn-filled w-full flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {setPwMut.isPending
                ? "儲存中⋯"
                : isFirstTime
                ? "設定密碼並繼續"
                : "更新密碼"}
            </button>

            {!isFirstTime && (
              <button
                type="button"
                onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
                className="w-full text-center text-label hover:text-foreground transition-colors text-xs flex items-center justify-center gap-1.5"
              >
                <ArrowLeft size={11} />
                返回登入
              </button>
            )}
          </form>
        )}

        {/* Footer */}
        <div className="text-center pt-2">
          <Link href="/">
            <span className="text-label hover:text-foreground transition-colors text-xs flex items-center justify-center gap-1.5 cursor-pointer">
              <ArrowLeft size={11} />
              返回網站首頁
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
