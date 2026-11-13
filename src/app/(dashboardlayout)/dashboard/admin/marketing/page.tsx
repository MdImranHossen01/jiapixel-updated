'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCcw,
  Send,
  Globe,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';

interface MarketingFormState {
  googleTagManagerId: string;
  googleAnalyticsId: string;
  googleSearchConsoleMeta: string;
  facebookDomainVerification: string;
  metaPixelId: string;
  facebookAccessToken: string;
  facebookTestEventCode: string;
  tiktokPixelId: string;
  tiktokAccessToken: string;
  tiktokDomainVerification: string;
  tiktokTestEventCode: string;
}

interface EnvFallbacks {
  googleTagManagerId?: string;
  googleAnalyticsId?: string;
  googleSearchConsoleMeta?: string;
  facebookDomainVerification?: string;
  metaPixelId?: string;
  hasFacebookAccessToken?: boolean;
  facebookTestEventCode?: string;
  tiktokPixelId?: string;
  hasTiktokAccessToken?: boolean;
  tiktokDomainVerification?: string;
  tiktokTestEventCode?: string;
}

type TrackingStatus = {
  facebook: {
    configured: boolean;
    pixelId: string | null;
    testEventCode: string | null;
    hasAccessToken: boolean;
    source?: 'db' | 'env' | 'none';
  };
  tiktok: {
    configured: boolean;
    pixelId: string | null;
    testEventCode: string | null;
    hasAccessToken: boolean;
    source?: 'db' | 'env' | 'none';
  };
  gtm: { configured: boolean; gtmId: string | null; source?: 'db' | 'env' | 'none' };
  ga: { configured: boolean; gaId: string | null; source?: 'db' | 'env' | 'none' };
} | null;

export default function AdminMarketingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingPlatform, setTestingPlatform] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [trackingStatus, setTrackingStatus] = useState<TrackingStatus>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [envFallbacks, setEnvFallbacks] = useState<EnvFallbacks>({});

  const [form, setForm] = useState<MarketingFormState>({
    googleTagManagerId: '',
    googleAnalyticsId: '',
    googleSearchConsoleMeta: '',
    facebookDomainVerification: '',
    metaPixelId: '',
    facebookAccessToken: '',
    facebookTestEventCode: '',
    tiktokPixelId: '',
    tiktokAccessToken: '',
    tiktokDomainVerification: '',
    tiktokTestEventCode: '',
  });

  const fetchTrackingStatus = useCallback(async () => {
    setStatusLoading(true);
    try {
      const res = await fetch('/api/admin/marketing/server-tracking');
      if (res.ok) {
        setTrackingStatus(await res.json());
      } else {
        setTrackingStatus(null);
      }
    } catch {
      setTrackingStatus(null);
    } finally {
      setStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/marketing');
        if (res.ok) {
          const data = await res.json();
          setForm({
            googleTagManagerId: data.googleTagManagerId || '',
            googleAnalyticsId: data.googleAnalyticsId || '',
            googleSearchConsoleMeta: data.googleSearchConsoleMeta || '',
            facebookDomainVerification: data.facebookDomainVerification || '',
            metaPixelId: data.metaPixelId || '',
            facebookAccessToken: data.facebookAccessToken || '',
            facebookTestEventCode: data.facebookTestEventCode || '',
            tiktokPixelId: data.tiktokPixelId || '',
            tiktokAccessToken: data.tiktokAccessToken || '',
            tiktokDomainVerification: data.tiktokDomainVerification || '',
            tiktokTestEventCode: data.tiktokTestEventCode || '',
          });
          setEnvFallbacks(data.envFallbacks || {});
        } else {
          toast.error('Failed to load marketing settings');
        }
      } catch {
        toast.error('Error loading marketing settings');
      } finally {
        setLoading(false);
      }
    }
    load();
    fetchTrackingStatus();
  }, [fetchTrackingStatus]);

  const handleChange = (key: keyof MarketingFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Marketing & Pixel settings saved successfully');
        await fetchTrackingStatus();
      } else {
        toast.error(data.error || 'Failed to save settings');
      }
    } catch {
      toast.error('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTestServerEvent = async (platform: 'facebook' | 'tiktok' | 'both') => {
    setTestingPlatform(platform);
    setTestResult(null);
    try {
      const res = await fetch('/api/admin/marketing/server-tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, eventName: 'PageView' }),
      });
      const data = await res.json();
      setTestResult(data);
      const fbOk = data?.results?.facebook?.success;
      const ttOk = data?.results?.tiktok?.success;
      if ((platform === 'facebook' && fbOk) || (platform === 'tiktok' && ttOk) || (platform === 'both' && (fbOk || ttOk))) {
        toast.success('Test server-side event sent!');
      } else {
        toast.error('Test event failed or missing credentials. See response below.');
      }
    } catch {
      toast.error('Failed to send test event');
    } finally {
      setTestingPlatform(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Marketing, Pixels & Server-Side Tracking</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Database values override <code>.env</code> automatically. Leave a field blank to use its <code>.env</code> fallback.
          </p>
        </div>
        <Button type="submit" form="jiapixel-marketing-form" disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {([
          { key: 'facebook', label: 'Meta CAPI' },
          { key: 'tiktok', label: 'TikTok API' },
          { key: 'gtm', label: 'GTM' },
          { key: 'ga', label: 'GA4' },
        ] as const).map(({ key, label }) => {
          const platform = trackingStatus?.[key];
          const isConfigured = platform?.configured ?? false;
          const source = platform?.source;
          return (
            <Card
              key={key}
              className={`border-2 ${
                trackingStatus === null
                  ? 'border-muted'
                  : isConfigured
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-destructive/30 bg-destructive/5'
              }`}
            >
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wide opacity-70">{label}</span>
                  {statusLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : trackingStatus === null ? (
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  ) : isConfigured ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <p
                    className={`text-sm font-bold ${
                      trackingStatus === null
                        ? 'text-muted-foreground'
                        : isConfigured
                          ? 'text-primary'
                          : 'text-destructive'
                    }`}
                  >
                    {trackingStatus === null ? '—' : isConfigured ? 'Connected' : 'Not Set'}
                  </p>
                  {source && source !== 'none' && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 uppercase">
                      {source}
                    </Badge>
                  )}
                </div>
                {platform && 'pixelId' in platform && platform.pixelId && (
                  <p className="text-[11px] text-muted-foreground mt-1 font-mono">{platform.pixelId}</p>
                )}
                {platform && 'gtmId' in platform && platform.gtmId && (
                  <p className="text-[11px] text-muted-foreground mt-1 font-mono">{platform.gtmId}</p>
                )}
                {platform && 'gaId' in platform && platform.gaId && (
                  <p className="text-[11px] text-muted-foreground mt-1 font-mono">{platform.gaId}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <form id="jiapixel-marketing-form" onSubmit={handleSave} className="space-y-6">
        {/* Google Analytics & Tag Manager */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5 text-primary" /> Google Tag Manager, GA4 & Search Console
            </CardTitle>
            <CardDescription>
              Configure Google Tag Manager, Google Analytics 4, and Search Console verification.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="font-bold text-xs">GTM Container ID</Label>
              <Input
                placeholder={envFallbacks.googleTagManagerId ? `.env: ${envFallbacks.googleTagManagerId}` : 'GTM-XXXXXXX'}
                value={form.googleTagManagerId}
                onChange={(e) => handleChange('googleTagManagerId', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-xs">GA4 Measurement ID</Label>
              <Input
                placeholder={envFallbacks.googleAnalyticsId ? `.env: ${envFallbacks.googleAnalyticsId}` : 'G-XXXXXXXXXX'}
                value={form.googleAnalyticsId}
                onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-xs">Google Site Verification Meta</Label>
              <Input
                placeholder={envFallbacks.googleSearchConsoleMeta ? `Default: ${envFallbacks.googleSearchConsoleMeta.slice(0, 14)}...` : 'Verification code'}
                value={form.googleSearchConsoleMeta}
                onChange={(e) => handleChange('googleSearchConsoleMeta', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Meta (Facebook) Pixel & CAPI */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-primary" /> Meta (Facebook) Pixel & Conversion API
            </CardTitle>
            <CardDescription>
              Client-side Browser Pixel + Server-side CAPI with automatic event deduplication.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold text-xs">Meta Pixel ID</Label>
                <Input
                  placeholder={envFallbacks.metaPixelId ? `.env: ${envFallbacks.metaPixelId}` : 'Enter Meta Pixel ID'}
                  value={form.metaPixelId}
                  onChange={(e) => handleChange('metaPixelId', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-xs">Facebook Access Token (CAPI)</Label>
                <Input
                  placeholder={envFallbacks.hasFacebookAccessToken ? 'Configured in .env (enter here to override)' : 'Enter Facebook CAPI Access Token'}
                  value={form.facebookAccessToken}
                  onChange={(e) => handleChange('facebookAccessToken', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold text-xs">FB Domain Verification</Label>
                <Input
                  placeholder={envFallbacks.facebookDomainVerification ? `Default: ${envFallbacks.facebookDomainVerification}` : 'Enter FB Domain Verification Key'}
                  value={form.facebookDomainVerification}
                  onChange={(e) => handleChange('facebookDomainVerification', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-xs">FB Test Event Code</Label>
                <Input
                  placeholder={envFallbacks.facebookTestEventCode ? `.env: ${envFallbacks.facebookTestEventCode}` : 'e.g. TEST12345'}
                  value={form.facebookTestEventCode}
                  onChange={(e) => handleChange('facebookTestEventCode', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TikTok Pixel & Events API */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-primary" /> TikTok Pixel & Events API
            </CardTitle>
            <CardDescription>
              Client-side TikTok Pixel + Server-side Events API v1.3 with deduplication.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold text-xs">TikTok Pixel ID</Label>
                <Input
                  placeholder={envFallbacks.tiktokPixelId ? `.env: ${envFallbacks.tiktokPixelId}` : 'Enter TikTok Pixel ID'}
                  value={form.tiktokPixelId}
                  onChange={(e) => handleChange('tiktokPixelId', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-xs">TikTok Access Token</Label>
                <Input
                  placeholder={envFallbacks.hasTiktokAccessToken ? 'Configured in .env (enter here to override)' : 'Enter TikTok Events API Access Token'}
                  value={form.tiktokAccessToken}
                  onChange={(e) => handleChange('tiktokAccessToken', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold text-xs">TikTok Domain Verification</Label>
                <Input
                  placeholder={envFallbacks.tiktokDomainVerification ? `.env: ${envFallbacks.tiktokDomainVerification}` : 'Enter TikTok Domain Verification Key'}
                  value={form.tiktokDomainVerification}
                  onChange={(e) => handleChange('tiktokDomainVerification', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-xs">TikTok Test Event Code</Label>
                <Input
                  placeholder={envFallbacks.tiktokTestEventCode ? `.env: ${envFallbacks.tiktokTestEventCode}` : 'e.g. TEST81538'}
                  value={form.tiktokTestEventCode}
                  onChange={(e) => handleChange('tiktokTestEventCode', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Server-Side Tracking Test Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Server-Side Event Diagnostics</CardTitle>
          <CardDescription>
            Send a live test <code>PageView</code> event directly from your server to verify DB or <code>.env</code> credentials.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fetchTrackingStatus}
              disabled={statusLoading}
              className="gap-1.5"
            >
              <RefreshCcw className={`h-3.5 w-3.5 ${statusLoading ? 'animate-spin' : ''}`} />
              Refresh Status
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleTestServerEvent('facebook')}
              disabled={testingPlatform !== null}
              className="gap-1.5"
            >
              {testingPlatform === 'facebook' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              Test Facebook CAPI
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleTestServerEvent('tiktok')}
              disabled={testingPlatform !== null}
              className="gap-1.5"
            >
              {testingPlatform === 'tiktok' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              Test TikTok Events API
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => handleTestServerEvent('both')}
              disabled={testingPlatform !== null}
              className="gap-1.5"
            >
              {testingPlatform === 'both' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              Test Both
            </Button>
          </div>

          {testResult && (
            <pre className="p-3 rounded-lg bg-muted text-xs overflow-x-auto max-h-64 font-mono">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-xs">
              <p className="font-bold mb-1">Security & Priority Rule</p>
              <p className="text-muted-foreground">
                Access Tokens saved in the database are encrypted with AES-256-GCM. If a field is left empty in the database, the system automatically falls back to your <code>.env</code> variables.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

