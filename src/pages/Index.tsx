import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

type StyleMode = 'minimalism' | 'geometry' | 'typography';

interface PortfolioItem {
  id: number;
  title: string;
  category: StyleMode;
  image_url: string;
  description?: string;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [styleMode, setStyleMode] = useState<StyleMode>('minimalism');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const { toast } = useToast();

  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'minimalism' as StyleMode,
    description: '',
    image: ''
  });

  const BACKEND_URL = 'https://functions.poehali.dev/f97add4b-c311-47d0-b1a0-ded0bd2855ed';

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const response = await fetch(BACKEND_URL);
      const data = await response.json();
      setPortfolioItems(data);
    } catch (error) {
      console.error('Failed to load portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadForm({ ...uploadForm, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.title || !uploadForm.image) {
      toast({ title: 'Ошибка', description: 'Заполните название и загрузите изображение', variant: 'destructive' });
      return;
    }

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadForm)
      });

      if (response.ok) {
        toast({ title: 'Успешно!', description: 'Работа добавлена в портфолио' });
        setShowUploadDialog(false);
        setUploadForm({ title: '', category: 'minimalism', description: '', image: '' });
        loadPortfolio();
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось загрузить работу', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast({ title: 'Удалено', description: 'Работа удалена из портфолио' });
        loadPortfolio();
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось удалить работу', variant: 'destructive' });
    }
  };

  const services = [
    { icon: 'Palette', title: 'Брендинг', description: 'Создание уникальных визуальных решений' },
    { icon: 'Layout', title: 'UI/UX Дизайн', description: 'Интерфейсы, которые работают' },
    { icon: 'Type', title: 'Типографика', description: 'Искусство правильных шрифтов' },
    { icon: 'Sparkles', title: 'Иллюстрация', description: 'Графика на заказ' },
  ];

  const blogPosts = [
    { title: 'Тренды дизайна 2026', date: '15 января 2026', category: 'Тренды' },
    { title: 'Минимализм в веб-дизайне', date: '10 января 2026', category: 'UI/UX' },
    { title: 'Психология цвета', date: '5 января 2026', category: 'Теория' },
  ];

  const getStyleClass = () => {
    switch (styleMode) {
      case 'geometry':
        return 'geometric-mode';
      case 'typography':
        return 'typo-mode';
      default:
        return 'minimal-mode';
    }
  };

  const filteredItems = portfolioItems.filter(item => item.category === styleMode);

  return (
    <div className={`min-h-screen ${getStyleClass()} transition-all duration-700`}>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PORTFOLIO
            </h1>
            <div className="hidden md:flex gap-8">
              {['home', 'gallery', 'services', 'blog', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`font-body capitalize transition-all ${
                    activeSection === section
                      ? 'text-primary font-semibold'
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  {section === 'home' ? 'Главная' : section === 'gallery' ? 'Галерея' : section === 'services' ? 'Услуги' : section === 'blog' ? 'Блог' : 'Контакты'}
                </button>
              ))}
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={isAdminMode ? 'bg-primary/20' : ''}
            >
              <Icon name="Settings" size={20} />
            </Button>
          </div>
        </div>
      </nav>

      {activeSection === 'home' && (
        <section className="pt-32 pb-20 px-6">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <Badge className="mb-6 glass-strong px-6 py-2 text-sm">
                Графический дизайнер
              </Badge>
              <h2 className="text-6xl md:text-8xl font-heading font-bold mb-6 bg-gradient-to-br from-foreground via-primary to-accent bg-clip-text text-transparent">
                Создаю визуальные истории
              </h2>
              <p className="text-xl text-muted-foreground mb-12 font-body max-w-2xl mx-auto">
                Трансформирую идеи в запоминающийся дизайн. Минимализм, геометрия и типографика — мои инструменты.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button 
                  size="lg" 
                  className="glass-strong hover:scale-105 transition-transform"
                  onClick={() => setActiveSection('gallery')}
                >
                  <Icon name="Briefcase" size={20} className="mr-2" />
                  Смотреть работы
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="glass hover:glass-strong transition-all"
                  onClick={() => setActiveSection('contact')}
                >
                  <Icon name="Mail" size={20} className="mr-2" />
                  Связаться
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeSection === 'gallery' && (
        <section className="pt-32 pb-20 px-6">
          <div className="container mx-auto">
            <div className="mb-12 text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <h2 className="text-5xl font-heading font-bold">Галерея работ</h2>
                {isAdminMode && (
                  <Button 
                    size="icon" 
                    onClick={() => setShowUploadDialog(true)}
                    className="glass-strong"
                  >
                    <Icon name="Plus" size={20} />
                  </Button>
                )}
              </div>
              <div className="flex gap-3 justify-center flex-wrap">
                {(['minimalism', 'geometry', 'typography'] as StyleMode[]).map((mode) => (
                  <Button
                    key={mode}
                    onClick={() => setStyleMode(mode)}
                    variant={styleMode === mode ? 'default' : 'outline'}
                    className={styleMode === mode ? 'glass-strong' : 'glass'}
                  >
                    {mode === 'minimalism' ? 'Минимализм' : mode === 'geometry' ? 'Геометрия' : 'Типография'}
                  </Button>
                ))}
              </div>
            </div>
            {loading ? (
              <div className="text-center text-muted-foreground">Загрузка...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {filteredItems.map((item, index) => (
                  <Card
                    key={item.id}
                    className="glass overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300 relative"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {isAdminMode && (
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    )}
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <Badge className="mb-3 glass-strong capitalize">{item.category}</Badge>
                      <h3 className="text-xl font-heading font-semibold">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {activeSection === 'services' && (
        <section className="pt-32 pb-20 px-6">
          <div className="container mx-auto">
            <h2 className="text-5xl font-heading font-bold mb-16 text-center">Услуги</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <Card
                  key={service.title}
                  className="glass p-8 hover:glass-strong transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6">
                    <Icon name={service.icon as any} size={32} className="text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-heading font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground font-body">{service.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeSection === 'blog' && (
        <section className="pt-32 pb-20 px-6">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-5xl font-heading font-bold mb-16 text-center">Блог</h2>
            <div className="space-y-6">
              {blogPosts.map((post, index) => (
                <Card
                  key={post.title}
                  className="glass p-8 hover:glass-strong transition-all cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <Badge className="mb-3 glass-strong">{post.category}</Badge>
                      <h3 className="text-2xl font-heading font-semibold mb-2">{post.title}</h3>
                      <p className="text-muted-foreground font-body">{post.date}</p>
                    </div>
                    <Icon name="ChevronRight" size={24} className="text-primary" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeSection === 'contact' && (
        <section className="pt-32 pb-20 px-6">
          <div className="container mx-auto max-w-2xl">
            <h2 className="text-5xl font-heading font-bold mb-16 text-center">Контакты</h2>
            <Card className="glass-strong p-12 animate-fade-in">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Icon name="Mail" size={24} className="text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-body">Email</p>
                    <p className="text-lg font-semibold">hello@portfolio.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Icon name="Phone" size={24} className="text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-body">Телефон</p>
                    <p className="text-lg font-semibold">+7 (999) 123-45-67</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Icon name="MapPin" size={24} className="text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-body">Локация</p>
                    <p className="text-lg font-semibold">Москва, Россия</p>
                  </div>
                </div>
              </div>
              <div className="mt-12 flex gap-4 justify-center">
                <Button className="glass hover:glass-strong">
                  <Icon name="Send" size={20} className="mr-2" />
                  Написать сообщение
                </Button>
              </div>
            </Card>
          </div>
        </section>
      )}

      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-40">
        <Button 
          size="icon" 
          className="glass-strong rounded-full w-14 h-14 hover:scale-110 transition-transform animate-float"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Icon name="ArrowUp" size={24} />
        </Button>
      </div>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="glass-strong border-white/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">Добавить работу</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="title">Название</Label>
              <Input
                id="title"
                className="glass mt-2"
                value={uploadForm.title}
                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                placeholder="Название работы"
              />
            </div>
            <div>
              <Label htmlFor="category">Категория</Label>
              <Select 
                value={uploadForm.category} 
                onValueChange={(value: StyleMode) => setUploadForm({ ...uploadForm, category: value })}
              >
                <SelectTrigger className="glass mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-strong border-white/20">
                  <SelectItem value="minimalism">Минимализм</SelectItem>
                  <SelectItem value="geometry">Геометрия</SelectItem>
                  <SelectItem value="typography">Типография</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Описание (опционально)</Label>
              <Textarea
                id="description"
                className="glass mt-2"
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                placeholder="Краткое описание"
              />
            </div>
            <div>
              <Label htmlFor="image">Изображение</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                className="glass mt-2"
                onChange={handleImageChange}
              />
            </div>
            <Button 
              className="w-full glass-strong" 
              onClick={handleUpload}
            >
              <Icon name="Upload" size={20} className="mr-2" />
              Загрузить работу
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
