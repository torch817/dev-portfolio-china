import React, { useState } from 'react';
import { Send, Mail, Code, MessageSquare } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';

export const ContactsSection: React.FC = () => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) {
      showToast('Ошибка заполнения', 'Пожалуйста, укажите имя и контакт для связи', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Сообщение отправлено!', 'Спасибо за обращение. Я свяжусь с вами в ближайшее время.', 'success');
      setName('');
      setContact('');
      setMessage('');
    }, 600);
  };

  return (
    <section id="contacts" className="py-12 border-t border-slate-200 dark:border-slate-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Контакты</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">Обсудить проект или задать вопрос</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quick Links */}
          <div className="space-y-4">
            <Card className="flex items-center gap-4 p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div className="p-3 rounded-xl bg-sky-500/10 text-sky-500 dark:text-sky-400 border border-sky-500/20">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Telegram (быстрый ответ)</div>
                <a 
                  href="https://t.me/whhwheqkkwk" 
                  target="_blank" 
                  rel="noreferrer"
                  className="font-medium text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  @whhwheqkkwk
                </a>
              </div>
            </Card>

            <Card className="flex items-center gap-4 p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border border-cyan-500/20">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Email</div>
                <a 
                  href="mailto:mikhail.sobolev.dev@gmail.com" 
                  className="font-medium text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  mikhail.sobolev.dev@gmail.com
                </a>
              </div>
            </Card>

            <Card className="flex items-center gap-4 p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">GitHub</div>
                <a 
                  href="https://github.com/torch817" 
                  target="_blank" 
                  rel="noreferrer"
                  className="font-medium text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  github.com/torch817
                </a>
              </div>
            </Card>
          </div>

          {/* Working Feedback Form */}
          <Card className="p-6">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              Форма обратной связи
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Ваше имя *"
                placeholder="Иван"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Telegram или Email для связи *"
                placeholder="@username или ivan@example.com"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />

              <Textarea
                label="Описание задачи (необязательно)"
                placeholder="Нужен сайт для приёма заказов / личный кабинет..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <Button 
                type="submit" 
                variant="primary" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};
