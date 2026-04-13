import React, { useState, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, UserPlus, Trash2, UserCheck, AlertCircle, Sparkles } from 'lucide-react';
import Papa from 'papaparse';
import { Person } from '@/src/types';
import { toast } from 'sonner';

interface DataSourceProps {
  onDataChange: (data: Person[]) => void;
}

const MOCK_NAMES = [
  '王小明', '李美玲', '張大衛', '陳雅婷', '林志強', 
  '黃詩涵', '吳家豪', '徐若瑄', '周杰倫', '蔡依林',
  '劉德華', '郭富城', '黎明', '張學友', '王菲',
  '那英', '周深', '毛不易', '李健', '汪峰'
];

export function DataSource({ onDataChange }: DataSourceProps) {
  const [textInput, setTextInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentNames = useMemo(() => {
    return textInput
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n !== '');
  }, [textInput]);

  const duplicates = useMemo(() => {
    const seen = new Set<string>();
    const dupes = new Set<string>();
    currentNames.forEach(name => {
      if (seen.has(name)) {
        dupes.add(name);
      }
      seen.add(name);
    });
    return Array.from(dupes);
  }, [currentNames]);

  const updatePeople = (names: string[]) => {
    const people: Person[] = names.map((name, index) => ({
      id: `${index}-${Date.now()}`,
      name,
    }));
    onDataChange(people);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
    const names = e.target.value
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n !== '');
    updatePeople(names);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const data = results.data as any[];
        let names: string[] = [];
        
        if (Array.isArray(data[0])) {
          names = data.map(row => row[0]).filter(n => n && typeof n === 'string' && n.trim() !== '');
        } else {
          names = data.map(row => row.name || Object.values(row)[0]).filter(n => n && typeof n === 'string' && n.trim() !== '');
        }

        if (names.length > 0) {
          const newText = names.join('\n');
          setTextInput(newText);
          updatePeople(names);
          toast.success(`成功匯入 ${names.length} 位名單`);
        } else {
          toast.error('無法從檔案中讀取有效的姓名');
        }
      },
      header: false,
      skipEmptyLines: true,
    });
  };

  const loadMockData = () => {
    const mockText = MOCK_NAMES.join('\n');
    setTextInput(mockText);
    updatePeople(MOCK_NAMES);
    toast.success('已載入模擬名單');
  };

  const removeDuplicates = () => {
    const uniqueNames = Array.from(new Set(currentNames)) as string[];
    setTextInput(uniqueNames.join('\n'));
    updatePeople(uniqueNames);
    toast.success(`已移除 ${currentNames.length - uniqueNames.length} 個重複姓名`);
  };

  const clearData = () => {
    setTextInput('');
    onDataChange([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.info('名單已清空');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              名單來源
            </CardTitle>
            <CardDescription>
              請上傳 CSV 檔案或直接貼上姓名
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={loadMockData} className="gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            載入模擬名單
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="csv-upload">上傳 CSV</Label>
          <div className="flex gap-2">
            <Input
              id="csv-upload"
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="cursor-pointer"
            />
          </div>
        </div>

        <div className="grid w-full items-center gap-1.5">
          <div className="flex justify-between items-center">
            <Label htmlFor="names-input">手動輸入名單 (每行一個姓名)</Label>
            {duplicates.length > 0 && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={removeDuplicates}
                className="h-7 text-xs"
              >
                移除重複 ({duplicates.length})
              </Button>
            )}
          </div>
          <div className="relative">
            <Textarea
              id="names-input"
              placeholder="王小明&#10;李華&#10;張三..."
              className={`min-h-[200px] font-mono ${duplicates.length > 0 ? 'border-destructive ring-destructive' : ''}`}
              value={textInput}
              onChange={handleTextChange}
            />
            {duplicates.length > 0 && (
              <div className="absolute bottom-2 right-2 flex items-center gap-1 text-destructive text-xs font-bold bg-destructive/10 px-2 py-1 rounded">
                <AlertCircle className="w-3 h-3" />
                偵測到重複姓名
              </div>
            )}
          </div>
          {duplicates.length > 0 && (
            <p className="text-xs text-destructive flex items-center gap-1">
              重複項：{duplicates.slice(0, 3).join(', ')}{duplicates.length > 3 ? '...' : ''}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center pt-2">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <UserCheck className="w-3 h-3" />
            有效人數: {currentNames.length}
          </div>
          <Button variant="ghost" size="sm" onClick={clearData} className="text-destructive hover:text-destructive h-8">
            <Trash2 className="w-4 h-4 mr-2" />
            清空名單
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
