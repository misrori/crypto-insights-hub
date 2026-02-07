import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  dates: string[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

export const DatePicker = ({ dates, selectedDate, onDateSelect }: DatePickerProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    };
    return date.toLocaleDateString('hu-HU', options);
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hu-HU', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-muted-foreground px-1">
        <Calendar className="h-4 w-4" />
        <span className="text-sm font-medium">Dátum kiválasztása</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {dates.map((date) => (
          <Button
            key={date}
            variant={selectedDate === date ? 'default' : 'outline'}
            size="sm"
            onClick={() => onDateSelect(date)}
            className={cn(
              'transition-all duration-200',
              selectedDate === date 
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                : 'bg-secondary/50 hover:bg-secondary border-border hover:border-primary/50'
            )}
            title={formatFullDate(date)}
          >
            {formatDate(date)}
          </Button>
        ))}
      </div>
    </div>
  );
};
