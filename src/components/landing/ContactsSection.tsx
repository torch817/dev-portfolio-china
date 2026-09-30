import React from 'react';
import { Send, Mail, Code, ArrowUpRight } from 'lucide-react';
import { Card } from '../ui/Card';

export const ContactsSection: React.FC = () => {
  return (
    <section id="contacts" className="py-12 border-t border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zinc-100">Контакты</h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">Прямые каналы для связи и обсуждения проектов</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Telegram */}
          <a 
            href="https://t.me/whhwheqkkwk" 
            target="_blank" 
            rel="noreferrer"
            className="group"
          >
            <Card className="p-5 border-zinc-800 hover:border-zinc-600 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400">Telegram (основной канал)</div>
                  <div className="font-semibold text-sm text-zinc-100 group-hover:text-zinc-300 transition-colors">
                    @whhwheqkkwk
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            </Card>
          </a>

          {/* Email */}
          <a 
            href="mailto:ob0lev@yandex.ru"
            className="group"
          >
            <Card className="p-5 border-zinc-800 hover:border-zinc-600 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400">Email</div>
                  <div className="font-semibold text-sm text-zinc-100 group-hover:text-zinc-300 transition-colors">
                    ob0lev@yandex.ru
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            </Card>
          </a>

          {/* GitHub */}
          <a 
            href="https://github.com/torch817" 
            target="_blank" 
            rel="noreferrer"
            className="group"
          >
            <Card className="p-5 border-zinc-800 hover:border-zinc-600 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400">GitHub</div>
                  <div className="font-semibold text-sm text-zinc-100 group-hover:text-zinc-300 transition-colors">
                    torch817
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            </Card>
          </a>
        </div>
      </div>
    </section>
  );
};
