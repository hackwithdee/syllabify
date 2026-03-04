import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Check, Zap, Sparkles, BarChart3, Shield, Loader2 } from 'lucide-react';
import { PRICING } from '@/hooks/useSubscription';

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgrade?: () => Promise<void>;
}

const freeFeatures = [
  'Up to 15 resources',
  '2 AI roadmap generations/month',
  'Basic difficulty classification',
  'Study timer',
  'Accountability partners',
];

const premiumFeatures = [
  'Unlimited resources',
  'Unlimited AI roadmaps',
  'Certification roadmap templates',
  'Advanced analytics dashboard',
  'Learning consistency breakdown',
  'Enhanced AI recommendations',
  'Priority reminders',
];

const UpgradeDialog = ({ open, onOpenChange, onUpgrade }: UpgradeDialogProps) => {
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [processing, setProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const price = plan === 'monthly' ? PRICING.monthly : PRICING.yearly;
  const period = plan === 'monthly' ? '/month' : '/year';
  const savings = plan === 'yearly' ? Math.round((1 - PRICING.yearly / (PRICING.monthly * 12)) * 100) : 0;

  const handlePayment = async () => {
    setProcessing(true);
    // Simulated payment — 2 second delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (onUpgrade) await onUpgrade();
    setProcessing(false);
    setConfirmed(true);
  };

  const handleClose = (val: boolean) => {
    if (!val) {
      setConfirmed(false);
      setPlan('monthly');
    }
    onOpenChange(val);
  };

  if (confirmed) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md text-center">
          <div className="py-6 space-y-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center mx-auto">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold font-display">Welcome to Premium! 🎉</h2>
            <p className="text-muted-foreground">All premium features are now unlocked. Enjoy unlimited learning!</p>
            <Button onClick={() => handleClose(false)} className="gradient-primary border-0 w-full">
              Start Exploring
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <Crown className="h-6 w-6 text-amber-500" />
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription>Unlock the full power of Syllabify</DialogDescription>
        </DialogHeader>

        {/* Plan toggle */}
        <div className="flex gap-2 p-1 rounded-xl bg-muted">
          <button
            onClick={() => setPlan('monthly')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${plan === 'monthly' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setPlan('yearly')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${plan === 'yearly' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
          >
            Yearly
            {savings > 0 && <span className="ml-1 text-xs text-success font-bold">-{savings}%</span>}
          </button>
        </div>

        {/* Price */}
        <div className="text-center py-2">
          <span className="text-4xl font-bold font-display">{PRICING.currency}{price.toLocaleString()}</span>
          <span className="text-muted-foreground text-sm">{period}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Free tier */}
          <div className="p-4 rounded-xl border bg-muted/30">
            <h3 className="font-display font-bold mb-3">Free — {PRICING.currency}0</h3>
            <ul className="space-y-2">
              {freeFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Premium tier */}
          <div className="p-4 rounded-xl border-2 border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-orange-500/5">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-display font-bold">Premium</h3>
              <Crown className="h-4 w-4 text-amber-500" />
            </div>
            <ul className="space-y-2">
              {premiumFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Button
          onClick={handlePayment}
          disabled={processing}
          className="w-full mt-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-0 text-white font-semibold h-12 text-base"
        >
          {processing ? (
            <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Processing Payment...</>
          ) : (
            <><Crown className="h-5 w-5 mr-2" /> Pay {PRICING.currency}{price.toLocaleString()}{period}</>
          )}
        </Button>
        <p className="text-xs text-center text-muted-foreground">Secure payment · Cancel anytime</p>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeDialog;
