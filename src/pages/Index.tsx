import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import HolographicCube from '@/components/HolographicCube';
import LoadingScreen from '@/components/LoadingScreen';

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
  const [isLoading, setIsLoading] = useState(true);
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

  const filteredItems = portfolioItems.filter(item => item.category === styleMode);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <div className="min-h-screen futuristic-bg">
          <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-primary/20">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <motion.h1
                  className="text-2xl font-display font-black glow-text"
                  animate={{
                    textShadow: [
                      '0 0 10px rgba(30, 144, 255, 0.8)',
                      '0 0 20px rgba(30, 144, 255, 0.8)',
                      '0 0 10px rgba(30, 144, 255, 0.8)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  PORTFOLIO
                </motion.h1>
                <div className="hidden md:flex gap-8">
                  {['home', 'gallery', 'services', 'blog', 'contact'].map((section) => (
                    <motion.button
                      key={section}
                      onClick={() => setActiveSection(section)}
                      className={`font-body capitalize transition-all relative ${
                        activeSection === section
                          ? 'text-primary font-semibold'
                          : 'text-white/70 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {section === 'home' ? 'Главная' : section === 'gallery' ? 'Галерея' : section === 'services' ? 'Услуги' : section === 'blog' ? 'Блог' : 'Контакты'}
                      {activeSection === section && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                          layoutId="underline"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className={`${isAdminMode ? 'bg-primary/20 glow' : ''} transition-all`}
                >
                  <Icon name="Settings" size={20} />
                </Button>
              </div>
            </div>
          </nav>

          <AnimatePresence mode="wait">
            {activeSection === 'home' && (
              <motion.section
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="pt-32 pb-20 px-6"
              >
                <div className="container mx-auto">
                  <div className="max-w-6xl mx-auto">
                    <HolographicCube />
                    <motion.div
                      className="text-center mt-12"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Badge className="mb-6 glass-strong px-6 py-2 text-sm holographic">
                        Графический дизайнер
                      </Badge>
                      <h2 className="text-5xl md:text-7xl font-display font-black mb-6 glow-text">
                        Имя Фамилия — Graphic Designer
                      </h2>
                      <p className="text-lg text-white/80 mb-12 font-body max-w-2xl mx-auto">
                        Создаю визуальные решения будущего. Сочетаю минимализм, технологии и инновации в каждом проекте.
                      </p>
                      <div className="flex gap-4 justify-center flex-wrap">
                        <Button
                          size="lg"
                          className="glass-strong glow hover:scale-105 transition-transform"
                          onClick={() => setActiveSection('gallery')}
                        >
                          <Icon name="Briefcase" size={20} className="mr-2" />
                          Смотреть работы
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          className="glass hover:glass-strong transition-all border-primary/50"
                          onClick={() => setActiveSection('contact')}
                        >
                          <Icon name="Mail" size={20} className="mr-2" />
                          Связаться
                        </Button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.section>
            )}

            {activeSection === 'gallery' && (
              <motion.section
                key="gallery"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="pt-32 pb-20 px-6"
              >
                <div className="container mx-auto">
                  <div className="mb-12 text-center">
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <h2 className="text-5xl font-display font-black glow-text">Галерея работ</h2>
                      {isAdminMode && (
                        <Button
                          size="icon"
                          onClick={() => setShowUploadDialog(true)}
                          className="glass-strong glow"
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
                          className={`${
                            styleMode === mode
                              ? 'glass-strong glow'
                              : 'glass border-primary/30 hover:border-primary/60'
                          } transition-all`}
                        >
                          {mode === 'minimalism' ? 'Минимализм' : mode === 'geometry' ? 'Геометрия' : 'Типография'}
                        </Button>
                      ))}
                    </div>
                  </div>
                  {loading ? (
                    <div className="text-center text-white/70">Загрузка...</div>
                  ) : (
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: 0.1,
                          },
                        },
                      }}
                    >
                      {filteredItems.map((item) => (
                        <motion.div
                          key={item.id}
                          variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0 },
                          }}
                        >
                          <Card className="glass-card overflow-hidden group cursor-pointer relative">
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
                              <Badge className="mb-3 glass-strong capitalize holographic">{item.category}</Badge>
                              <h3 className="text-xl font-heading font-bold text-background">{item.title}</h3>
                              {item.description && (
                                <p className="text-sm text-background/80 mt-2 font-body">{item.description}</p>
                              )}
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.section>
            )}

            {activeSection === 'services' && (
              <motion.section
                key="services"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="pt-32 pb-20 px-6"
              >
                <div className="container mx-auto">
                  <h2 className="text-5xl font-display font-black mb-16 text-center glow-text">Услуги</h2>
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.1,
                        },
                      },
                    }}
                  >
                    {services.map((service) => (
                      <motion.div
                        key={service.title}
                        variants={{
                          hidden: { opacity: 0, scale: 0.8 },
                          visible: { opacity: 1, scale: 1 },
                        }}
                      >
                        <Card className="glass p-8 hover:glass-strong transition-all duration-300 hover:glow group">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Icon name={service.icon as any} size={32} className="text-white" />
                          </div>
                          <h3 className="text-2xl font-heading font-bold mb-3">{service.title}</h3>
                          <p className="text-white/70 font-body text-sm">{service.description}</p>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.section>
            )}

            {activeSection === 'blog' && (
              <motion.section
                key="blog"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="pt-32 pb-20 px-6"
              >
                <div className="container mx-auto max-w-4xl">
                  <h2 className="text-5xl font-display font-black mb-16 text-center glow-text">Блог</h2>
                  <div className="space-y-6">
                    {blogPosts.map((post, index) => (
                      <motion.div
                        key={post.title}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="glass p-8 hover:glass-strong transition-all cursor-pointer group">
                          <div className="flex items-start justify-between gap-6">
                            <div className="flex-1">
                              <Badge className="mb-3 glass-strong holographic">{post.category}</Badge>
                              <h3 className="text-2xl font-heading font-bold mb-2 group-hover:text-primary transition-colors">
                                {post.title}
                              </h3>
                              <p className="text-white/60 font-body text-sm">{post.date}</p>
                            </div>
                            <Icon name="ChevronRight" size={24} className="text-primary group-hover:translate-x-2 transition-transform" />
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {activeSection === 'contact' && (
              <motion.section
                key="contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="pt-32 pb-20 px-6"
              >
                <div className="container mx-auto max-w-2xl">
                  <h2 className="text-5xl font-display font-black mb-16 text-center glow-text">Контакты</h2>
                  <Card className="glass-strong p-12">
                    <div className="space-y-8">
                      <motion.div
                        className="flex items-center gap-4"
                        whileHover={{ x: 10 }}
                      >
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow">
                          <Icon name="Mail" size={24} className="text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-white/60 font-body">Email</p>
                          <p className="text-lg font-semibold">hello@portfolio.com</p>
                        </div>
                      </motion.div>
                      <motion.div
                        className="flex items-center gap-4"
                        whileHover={{ x: 10 }}
                      >
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow">
                          <Icon name="Phone" size={24} className="text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-white/60 font-body">Телефон</p>
                          <p className="text-lg font-semibold">+7 (999) 123-45-67</p>
                        </div>
                      </motion.div>
                      <motion.div
                        className="flex items-center gap-4"
                        whileHover={{ x: 10 }}
                      >
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow">
                          <Icon name="MapPin" size={24} className="text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-white/60 font-body">Локация</p>
                          <p className="text-lg font-semibold">Москва, Россия</p>
                        </div>
                      </motion.div>
                    </div>
                    <div className="mt-12 flex gap-4 justify-center">
                      <Button className="glass-strong glow hover:scale-105 transition-transform">
                        <Icon name="Send" size={20} className="mr-2" />
                        Написать сообщение
                      </Button>
                    </div>
                  </Card>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          <motion.div
            className="fixed bottom-8 right-8 z-40"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
          >
            <Button
              size="icon"
              className="glass-strong rounded-full w-14 h-14 glow hover:scale-110 transition-transform"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Icon name="ArrowUp" size={24} />
            </Button>
          </motion.div>

          <footer className="metallic-footer py-16 mt-32">
            <div className="container mx-auto text-center">
              <div className="w-px h-24 bg-gradient-to-b from-transparent via-primary to-transparent mx-auto mb-8 glow" />
              <p className="text-white/60 font-body text-sm mb-4">
                © 2026 Portfolio. Все права защищены.
              </p>
              <div className="flex gap-6 justify-center">
                <Button variant="ghost" size="icon" className="hover:glow transition-all">
                  <Icon name="Github" size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="hover:glow transition-all">
                  <Icon name="Linkedin" size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="hover:glow transition-all">
                  <Icon name="Instagram" size={20} />
                </Button>
              </div>
            </div>
          </footer>

          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogContent className="glass-strong border-primary/30 max-w-md">
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl glow-text">Добавить работу</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="title" className="text-white/80">Название</Label>
                  <Input
                    id="title"
                    className="glass mt-2 border-primary/30 focus:border-primary"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    placeholder="Название работы"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-white/80">Категория</Label>
                  <Select
                    value={uploadForm.category}
                    onValueChange={(value: StyleMode) => setUploadForm({ ...uploadForm, category: value })}
                  >
                    <SelectTrigger className="glass mt-2 border-primary/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-strong border-primary/30">
                      <SelectItem value="minimalism">Минимализм</SelectItem>
                      <SelectItem value="geometry">Геометрия</SelectItem>
                      <SelectItem value="typography">Типография</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description" className="text-white/80">Описание (опционально)</Label>
                  <Textarea
                    id="description"
                    className="glass mt-2 border-primary/30 focus:border-primary"
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    placeholder="Краткое описание"
                  />
                </div>
                <div>
                  <Label htmlFor="image" className="text-white/80">Изображение</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="glass mt-2 border-primary/30"
                    onChange={handleImageChange}
                  />
                </div>
                <Button
                  className="w-full glass-strong glow"
                  onClick={handleUpload}
                >
                  <Icon name="Upload" size={20} className="mr-2" />
                  Загрузить работу
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default Index;
