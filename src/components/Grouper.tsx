import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, UsersRound, Shuffle, Download, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { Person, Group } from '@/src/types';
import { toast } from 'sonner';

interface GrouperProps {
  people: Person[];
}

export function Grouper({ people }: GrouperProps) {
  const [perGroup, setPerGroup] = useState(2);
  const [groups, setGroups] = useState<Group[]>([]);

  const handleGroup = () => {
    if (people.length === 0) {
      toast.error('請先匯入名單');
      return;
    }

    if (perGroup < 1) {
      toast.error('每組人數必須至少為 1');
      return;
    }

    const shuffled = [...people].sort(() => Math.random() - 0.5);
    const newGroups: Group[] = [];
    const groupCount = Math.ceil(shuffled.length / perGroup);

    for (let i = 0; i < groupCount; i++) {
      newGroups.push({
        id: `group-${i}`,
        name: `第 ${i + 1} 組`,
        members: shuffled.slice(i * perGroup, (i + 1) * perGroup),
      });
    }

    setGroups(newGroups);
    toast.success(`已成功分成 ${newGroups.length} 組`);
  };

  const exportGroups = () => {
    if (groups.length === 0) return;
    
    const content = groups.map(g => `${g.name}\n${g.members.map(m => m.name).join(', ')}`).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '分組結果.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    if (groups.length === 0) return;

    const rows = [];
    // Find max members in any group to determine columns
    const maxMembers = Math.max(...groups.map(g => g.members.length));
    
    // Header
    const header = ['組別', ...Array.from({ length: maxMembers }, (_, i) => `成員 ${i + 1}`)];
    rows.push(header.join(','));

    // Data
    groups.forEach(g => {
      const row = [g.name, ...g.members.map(m => m.name)];
      // Fill empty cells if needed
      while (row.length < header.length) row.push('');
      rows.push(row.map(cell => `"${cell}"`).join(','));
    });

    const csvContent = '\uFEFF' + rows.join('\n'); // Add BOM for Excel Chinese support
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '分組結果.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersRound className="w-6 h-6" />
            自動分組
          </CardTitle>
          <CardDescription>
            設定每組人數，系統將隨機分配名單
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="per-group">每組人數</Label>
              <Input
                id="per-group"
                type="number"
                min="1"
                value={perGroup}
                onChange={(e) => setPerGroup(parseInt(e.target.value) || 1)}
              />
            </div>
            <Button onClick={handleGroup} className="gap-2">
              <Shuffle className="w-4 h-4" />
              開始分組
            </Button>
            {groups.length > 0 && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={exportGroups} className="gap-2">
                  <Download className="w-4 h-4" />
                  導出 TXT
                </Button>
                <Button variant="outline" onClick={exportCSV} className="gap-2">
                  <FileText className="w-4 h-4" />
                  導出 CSV
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {groups.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group, groupIdx) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIdx * 0.05 }}
            >
              <Card className="h-full border-l-4 border-l-primary">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between items-center">
                    {group.name}
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {group.members.length} 人
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {group.members.map((member, mIdx) => (
                      <li key={member.id} className="flex items-center gap-2 text-sm">
                        <span className="w-5 h-5 flex items-center justify-center bg-secondary rounded-full text-[10px] font-bold">
                          {mIdx + 1}
                        </span>
                        {member.name}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
