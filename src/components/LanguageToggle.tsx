import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LanguageToggleProps {
  language: 'hu' | 'en';
  onLanguageChange: (lang: 'hu' | 'en') => void;
}

export const LanguageToggle = ({ language, onLanguageChange }: LanguageToggleProps) => {
  return (
    <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onLanguageChange('hu')}
        className={cn(
          'h-8 px-3 transition-all',
          language === 'hu' 
            ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground hover:bg-transparent'
        )}
      >
        🇭🇺 HU
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onLanguageChange('en')}
        className={cn(
          'h-8 px-3 transition-all',
          language === 'en' 
            ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground hover:bg-transparent'
        )}
      >
        🇬🇧 EN
      </Button>
    </div>
  );
};
