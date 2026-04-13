import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Trophy, RotateCcw, Play, Pause, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Person } from '@/src/types';
import { toast } from 'sonner';

interface LuckyDrawProps {
  people: Person[];
}

export function LuckyDraw({ people }: LuckyDrawProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [allowDuplicate, setAllowDuplicate] = useState(false);
  const [winner, setWinner] = useState<Person | null>(null);
  const [pool, setPool] = useState<Person[]>([]);
  const [drawnWinners, setDrawnWinners] = useState<Person[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const drawIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const winAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setPool(people);
    setDrawnWinners([]);
    setWinner(null);
  }, [people]);

  useEffect(() => {
    // Setup audio
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3'); // Ticking sound
    audioRef.current.loop = true;
    winAudioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'); // Win sound
  }, []);

  const startDraw = () => {
    if (people.length === 0) {
      toast.error('請先匯入名單');
      return;
    }

    const currentPool = allowDuplicate ? people : pool;
    if (currentPool.length === 0) {
      toast.error('所有人都已經抽過了！');
      return;
    }

    setIsDrawing(true);
    setWinner(null);
    audioRef.current?.play().catch(() => {});

    let speed = 50;
    const run = () => {
      setCurrentIndex((prev) => (prev + 1) % currentPool.length);
      drawIntervalRef.current = setTimeout(run, speed);
    };
    run();

    // Stop after 3 seconds
    setTimeout(() => {
      stopDraw(currentPool);
    }, 3000);
  };

  const stopDraw = (currentPool: Person[]) => {
    if (drawIntervalRef.current) clearTimeout(drawIntervalRef.current);
    setIsDrawing(false);
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;

    const randomIndex = Math.floor(Math.random() * currentPool.length);
    const selectedWinner = currentPool[randomIndex];
    
    setWinner(selectedWinner);
    setDrawnWinners((prev) => [selectedWinner, ...prev]);
    
    if (!allowDuplicate) {
      setPool((prev) => prev.filter((p) => p.id !== selectedWinner.id));
    }

    winAudioRef.current?.play().catch(() => {});
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF4500']
    });
  };

  const reset = () => {
    setPool(people);
    setDrawnWinners([]);
    setWinner(null);
    toast.info('抽籤已重置');
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-2 border-primary/20 shadow-xl">
        <CardHeader className="bg-primary/5">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Trophy className="w-6 h-6 text-yellow-500" />
                獎品抽籤
              </CardTitle>
              <CardDescription>
                點擊按鈕開始隨機抽取幸運兒
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2 bg-background p-2 rounded-lg border">
              <Switch
                id="duplicate-mode"
                checked={allowDuplicate}
                onCheckedChange={setAllowDuplicate}
                disabled={isDrawing}
              />
              <Label htmlFor="duplicate-mode" className="text-sm font-medium">
                可重複抽取
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-12 flex flex-col items-center justify-center min-h-[300px]">
          <AnimatePresence mode="wait">
            {isDrawing ? (
              <motion.div
                key="drawing"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                className="text-6xl md:text-8xl font-black text-primary tracking-tighter text-center"
              >
                {people[currentIndex]?.name || '...'}
              </motion.div>
            ) : winner ? (
              <motion.div
                key="winner"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-sm uppercase tracking-widest text-yellow-600 font-bold"
                >
                  恭喜中獎者！
                </motion.div>
                <div className="text-7xl md:text-9xl font-black text-primary drop-shadow-lg">
                  {winner.name}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-muted-foreground text-xl italic"
              >
                準備好開始了嗎？
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex gap-4">
            <Button
              size="lg"
              className="h-16 px-12 text-xl font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
              onClick={startDraw}
              disabled={isDrawing || people.length === 0}
            >
              {isDrawing ? <Pause className="mr-2 h-6 w-6 animate-pulse" /> : <Play className="mr-2 h-6 w-6" />}
              {isDrawing ? '抽籤中...' : '開始抽籤'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-16 w-16 rounded-full"
              onClick={reset}
              disabled={isDrawing}
            >
              <RotateCcw className="h-6 w-6" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {drawnWinners.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              中獎紀錄 ({drawnWinners.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {drawnWinners.map((w, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={`${w.id}-${i}`}
                  className="bg-secondary px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-2"
                >
                  <span className="text-xs opacity-50">#{drawnWinners.length - i}</span>
                  {w.name}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
