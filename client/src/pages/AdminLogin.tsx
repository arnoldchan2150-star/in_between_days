import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: isSet } = trpc.auth.isAdminPasswordSet.useQuery();

  const setupMutation = trpc.auth.setupAdminPassword.useMutation({
    onSuccess: () => {
      toast.success("管理員帳號設定成功，請重新登入");
    },
    onError: (err) => toast.error(err.message),
  });

  const loginMutation = trpc.auth.emailLogin.useMutation({
    onSuccess: () => {
      toast.success("登入成功");
      navigate("/admin");
    },
    onError: (err) => toast.error(err.message || "登入失敗"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) return;
    setLoading(true);
    try {
      if (!isSet) {
        await setupMutation.mutateAsync({ email: form.email, password: form.password });
      } else {
        await loginMutation.mutateAsync({ email: form.email, password: form.password });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm px-6">
        <div className="text-center mb-10">
          <p className="font-serif text-sm tracking-[0.2em] uppercase text-foreground mb-1">
            In-Between Days
          </p>
          <p className="text-xs text-muted-foreground tracking-widest">管理後台</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">
              電子信箱
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="admin@example.com"
              required
              className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground tracking-wider block mb-1.5">
              密碼 {!isSet && <span className="text-muted-foreground/60">（首次設定，請輸入至少 8 位）</span>}
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder={!isSet ? "設定管理員密碼（至少 8 位）" : "輸入密碼"}
                required
                minLength={!isSet ? 8 : 1}
                className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-background py-3 text-xs tracking-widest hover:bg-foreground/80 transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? "處理中..." : !isSet ? "設定並登入" : "登入"}
          </button>
        </form>
      </div>
    </div>
  );
}
