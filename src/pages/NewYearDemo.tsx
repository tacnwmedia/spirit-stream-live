import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, PartyPopper, Clock, Timer } from 'lucide-react';
import NewYearCountdown from '@/components/NewYearCountdown';

const NewYearDemo = () => {
  const [searchParams] = useSearchParams();
  const currentDemo = searchParams.get('mode') || 'countdown';

  const demos = [
    {
      id: 'countdown',
      name: 'Countdown',
      description: 'Normal countdown timer (auto-hides after 6s)',
      icon: Clock,
    },
    {
      id: 'lastminute',
      name: 'Last Minute',
      description: 'Final minute before midnight (stays visible)',
      icon: Timer,
    },
    {
      id: 'newyear',
      name: 'New Year',
      description: 'Celebration with confetti (auto-hides after 10s)',
      icon: PartyPopper,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Demo banner will appear based on URL param */}
      <NewYearCountdown />

      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="mb-2 text-3xl font-bold text-foreground">
          New Year Countdown Demo
        </h1>
        <p className="mb-8 text-muted-foreground">
          Preview the countdown banner in different states. Select a mode below to see how it looks.
        </p>

        <div className="grid gap-4">
          {demos.map((demo) => {
            const Icon = demo.icon;
            const isActive = currentDemo === demo.id;

            return (
              <Link
                key={demo.id}
                to={`/demo/newyear?mode=${demo.id}`}
                className={`group relative overflow-hidden rounded-xl border p-4 transition-all ${
                  isActive
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : 'border-border bg-card hover:border-primary/50 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`rounded-lg p-2.5 ${
                      isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{demo.name}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{demo.description}</p>
                  </div>
                  {isActive && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                      Active
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-4">
          <h3 className="font-medium text-foreground">How it works</h3>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            <li>• The banner appears at the bottom of the screen</li>
            <li>• Tap the X button or wait for it to auto-dismiss</li>
            <li>• In "Last Minute" mode, it stays visible until countdown ends</li>
            <li>• "New Year" mode shows the celebration with confetti</li>
          </ul>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          This demo page is for testing purposes only.
          <br />
          The actual countdown will appear on Dec 31st at 9 PM (Chicago time).
        </p>
      </div>
    </div>
  );
};

export default NewYearDemo;

