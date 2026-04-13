/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataSource } from '@/src/components/DataSource';
import { LuckyDraw } from '@/src/components/LuckyDraw';
import { Grouper } from '@/src/components/Grouper';
import { Toaster } from '@/components/ui/sonner';
import { Person } from '@/src/types';
import { Trophy, Users, Settings2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [people, setPeople] = useState<Person[]>([]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a] font-sans selection:bg-primary/20">
      {/* Header */}
      <header className="bg-white border-bottom border-gray-200 py-6 px-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase">LuckyDraw & Grouper</h1>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">抽籤與分組工具</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              目前名單: {people.length} 人
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar / Data Source */}
          <aside className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <DataSource onDataChange={setPeople} />
            </motion.div>
            
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
              <h3 className="font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                使用說明
              </h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>1. 在左側匯入或輸入名單</li>
                <li>2. 切換標籤選擇功能</li>
                <li>3. 點擊按鈕開始執行</li>
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="draw" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 h-12 p-1 bg-white border shadow-sm rounded-xl">
                <TabsTrigger value="draw" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                  <Trophy className="w-4 h-4 mr-2" />
                  獎品抽籤
                </TabsTrigger>
                <TabsTrigger value="group" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                  <Users className="w-4 h-4 mr-2" />
                  自動分組
                </TabsTrigger>
              </TabsList>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <TabsContent value="draw" className="mt-0 focus-visible:outline-none">
                  <LuckyDraw people={people} />
                </TabsContent>
                <TabsContent value="group" className="mt-0 focus-visible:outline-none">
                  <Grouper people={people} />
                </TabsContent>
              </motion.div>
            </Tabs>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t mt-20 text-center text-muted-foreground text-sm">
        <p>© 2024 LuckyDraw & Grouper. Built with precision.</p>
      </footer>

      <Toaster position="top-center" richColors />
    </div>
  );
}

