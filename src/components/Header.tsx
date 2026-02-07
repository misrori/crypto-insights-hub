import { Zap, Menu, X } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';
import { useState } from 'react';

interface HeaderProps {
  language: 'hu' | 'en';
  onLanguageChange: (lang: 'hu' | 'en') => void;
}

export const Header = ({ language, onLanguageChange }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-crypto-cyan flex items-center justify-center shadow-lg shadow-primary/25">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-foreground">
              Crypto News
            </h1>
            <p className="text-xs text-muted-foreground">
              AI-összefoglalók YouTuberekről
            </p>
          </div>
        </div>

        <LanguageToggle 
          language={language} 
          onLanguageChange={onLanguageChange} 
        />
      </div>
    </header>
  );
};
