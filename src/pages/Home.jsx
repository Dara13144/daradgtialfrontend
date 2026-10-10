import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Zap,
  Sparkles,
  Gamepad2,
  Gift,
  Code2,
  Send,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Flame,
  Clock
} from 'lucide-react';
import { endpoints } from '../services/api.js';
import { ProductCard } from '../components/product/ProductCard.jsx';
import { ProductCardSkeleton } from '../components/common/Badge.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useTelegram } from '../hooks/useTelegram.js';

const categoryImageMap = {
  bloxfruits: '/categories/bloxfruits.png',
  fruits: '/categories/fruits.png',
  gamepass: '/categories/gamepass.png',
  topup: '/icons/robux_gold.png'
};

export function Home() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [discountProducts, setDiscountProducts] = useState([]);
  const [flashSale, setFlashSale] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, isExpired: false });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const { lang, t } = useLanguage();
  const { haptic } = useTelegram();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [catsRes, featRes, discRes, settingsRes] = await Promise.allSettled([
          endpoints.getCategories(),
          endpoints.getProducts({ featured: true, limit: 6 }),
          endpoints.getProducts({ sortBy: 'popular', limit: 6 }),
          endpoints.getSettings()
        ]);

        if (catsRes.status === 'fulfilled' && catsRes.value?.success) setCategories(catsRes.value.data);
        const isExcluded = (p) =>
          p.category?.slug === 'topup' ||
          p.category?.slug === 'gamepass' ||
          p.category_id === '10000000-0000-0000-0000-000000000006' ||
          p.category_id === '10000000-0000-0000-0000-000000000003' ||
          p.name?.toLowerCase().includes('gamepass') ||
          p.name?.toLowerCase().includes('fast top-up') ||
          p.name?.toLowerCase().includes('robux');

        if (featRes.status === 'fulfilled' && featRes.value?.success) {
          const filtered = (featRes.value.data.items || []).filter((p) => !isExcluded(p));
          setFeaturedProducts(filtered);
        }
        if (discRes.status === 'fulfilled' && discRes.value?.success) {
          const filtered = (discRes.value.data.items || []).filter((p) => !isExcluded(p));
          setDiscountProducts(filtered);
        }
        if (settingsRes.status === 'fulfilled' && settingsRes.value?.success && settingsRes.value.data?.flash_sale) {
          setFlashSale(settingsRes.value.data.flash_sale);
        }
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Live ticking countdown for Flash Sale
  useEffect(() => {
    if (!flashSale?.end_time) return;

    function calculateTime() {
      const diff = new Date(flashSale.end_time).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24) + days * 24;
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ hours, minutes, seconds, isExpired: false });
    }

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [flashSale?.end_time]);

  // Load products for selected category on Home
  useEffect(() => {
    if (!selectedCategory) {
      setCategoryProducts([]);
      return;
    }
    async function loadCategoryProducts() {
      setCategoryLoading(true);
      try {
        const res = await endpoints.getProducts({
          categorySlug: selectedCategory === 'hot' ? undefined : selectedCategory,
          filter: selectedCategory === 'hot' ? 'hot' : undefined,
          limit: 12
        });
        if (res.success && res.data?.items) {
          setCategoryProducts(res.data.items);
        } else {
          setCategoryProducts([]);
        }
      } catch (err) {
        console.error('Error loading category products on Home:', err);
        setCategoryProducts([]);
      } finally {
        setCategoryLoading(false);
      }
    }
    loadCategoryProducts();
  }, [selectedCategory]);

  const handleCategoryClick = (slug) => {
    haptic('selection');
    if (slug === 'topup') {
      navigate('/topup');
      return;
    }
    if (selectedCategory === slug && slug) {
      navigate(slug === 'hot' ? '/shop?filter=hot' : `/shop?category=${slug}`);
      return;
    }
    setSelectedCategory(slug);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      haptic('light');
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Icon mapping helper
  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Gamepad2': return Gamepad2;
      case 'Gift': return Gift;
      case 'Code2': return Code2;
      case 'Sparkles': return Sparkles;
      case 'Send': return Send;
      default: return Zap;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Maiser Store Anime Hero Banner */}
      <Link
        to="/shop"
        onClick={() => haptic('medium')}
        className="block relative rounded-3xl overflow-hidden border border-pink-500/40 hover:border-pink-500/70 shadow-2xl bg-slate-950 group active:scale-[0.99] transition-all"
      >
        <div className="relative overflow-hidden w-full aspect-[1024/409] max-h-[380px] bg-slate-950">
          <img
            src="/maiser_hero_banner.png"
            alt="Maiser Store Hero Banner"
            className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500 ease-out"
          />

          {/* Ambient Gradient Lighting */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      </Link>


      {/* Category Pills & Feature Tabs matching user screenshot & Shop */}
      <div className="flex gap-2 sm:gap-2.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar items-center">
        {/* 1. Hot Flame Icon Button */}
        <button
          type="button"
          onClick={() => handleCategoryClick(selectedCategory === 'hot' ? '' : 'hot')}
          title="Hot Deals & Trending"
          className={`flex items-center justify-center w-11 h-10 rounded-2xl shrink-0 transition-all duration-200 active:scale-95 ${
            selectedCategory === 'hot'
              ? 'bg-[#2a0815] border-2 border-pink-500 shadow-[0_0_16px_rgba(236,72,153,0.6)]'
              : 'bg-[#181120]/90 border border-pink-500/40 hover:border-pink-500 text-pink-400'
          }`}
        >
          <img src="/icons/hot_flame.png" alt="Hot Deals" className="w-5 h-5 object-contain" />
        </button>

        {/* 2. Robux Top-Up Button with Gold Coin */}
        <button
          type="button"
          onClick={() => handleCategoryClick('topup')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all duration-200 active:scale-95 ${
            selectedCategory === 'topup'
              ? 'bg-[#181120] border-2 border-pink-500 text-white shadow-[0_0_14px_rgba(236,72,153,0.55),0_2px_8px_rgba(244,63,94,0.4)]'
              : 'bg-[#131118]/90 border border-slate-800/80 text-slate-300 hover:text-white hover:border-slate-700'
          }`}
        >
          <img src="/icons/robux_gold.png" alt="Robux" className="w-5 h-5 object-contain shrink-0" />
          <span>{lang === 'km' ? 'បញ្ចូលលុយ Game' : 'Robux Top-Up'}</span>
        </button>

        {/* 3. All Products Button */}
        <button
          type="button"
          onClick={() => handleCategoryClick('')}
          className={`flex items-center justify-center px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all duration-200 active:scale-95 ${
            selectedCategory === ''
              ? 'bg-[#181120] border-2 border-pink-500 text-white shadow-[0_0_14px_rgba(236,72,153,0.55),0_2px_8px_rgba(244,63,94,0.4)]'
              : 'bg-[#131118]/90 border border-slate-800/80 text-slate-300 hover:text-white hover:border-slate-700'
          }`}
        >
          <span>{t('common.all') || 'All'}</span>
        </button>

        {/* 4. Other Categories (Bloxfruits, Fruits, Gamepass, Steal an Egg...) */}
        {categories
          .filter((cat) => cat.slug !== 'topup' && cat.slug !== 'game-keys')
          .map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            const displayName = lang === 'km' && cat.name_km ? cat.name_km : cat.name;
            const iconUrl = categoryImageMap[cat.slug] || cat.image_url;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.slug)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? 'bg-[#181120] border-2 border-pink-500 text-white shadow-[0_0_14px_rgba(236,72,153,0.55),0_2px_8px_rgba(244,63,94,0.4)]'
                    : 'bg-[#131118]/90 border border-slate-800/80 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                {iconUrl && (
                  <div className="w-5 h-5 rounded-md overflow-hidden flex items-center justify-center shrink-0">
                    <img src={iconUrl} alt={displayName} className="w-full h-full object-contain" />
                  </div>
                )}
                <span>{displayName}</span>
              </button>
            );
          })}
      </div>

      {/* Selected Category Products on Home */}
      {selectedCategory && (
        <section className="space-y-3.5 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 border border-pink-500/40 flex items-center justify-center p-1 shadow-lg shadow-pink-500/10">
                {selectedCategory === 'hot' ? (
                  <img src="/icons/hot_flame.png" alt="" className="w-5 h-5 object-contain" />
                ) : categoryImageMap[selectedCategory] ? (
                  <img src={categoryImageMap[selectedCategory]} alt="" className="w-full h-full object-contain" />
                ) : (
                  <Sparkles className="w-4 h-4 text-pink-400" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-100 capitalize">
                  {selectedCategory === 'hot'
                    ? (lang === 'km' ? 'ទំនិញពេញនិយម & លក់ដាច់' : 'Hot Deals & Trending')
                    : categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                </h2>
                {!categoryLoading && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/30">
                    {categoryProducts.length} items
                  </span>
                )}
              </div>
            </div>

            <Link
              to={selectedCategory === 'hot' ? '/shop?filter=hot' : `/shop?category=${selectedCategory}`}
              className="text-xs font-bold text-pink-400 hover:text-pink-300 hover:underline flex items-center gap-1"
            >
              <span>{t('home.viewAll') || 'View All in Shop'}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
            {categoryLoading ? (
              Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
            ) : categoryProducts.length > 0 ? (
              categoryProducts.map((p) => <ProductCard key={p.id} product={p} />)
            ) : (
              <div className="col-span-full py-12 text-center text-slate-400 text-xs rounded-2xl border border-slate-800/80 bg-slate-900/30">
                {lang === 'km' ? 'មិនមានទំនិញក្នុងក្រុមនេះនៅឡើយទេ' : 'No products found in this category'}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Flash Sale / Featured Products */}
      {(!flashSale || flashSale.enabled !== false) && (
        <section className="space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-800/60">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500/20 via-orange-500/20 to-amber-500/20 border border-rose-500/40 flex items-center justify-center shadow-lg">
                  <Flame className="w-5 h-5 text-rose-500 fill-rose-500 animate-flame" />
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-100 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-rose-400 via-orange-300 to-amber-300 bg-clip-text text-transparent">
                    {lang === 'km' && flashSale?.title_km ? flashSale.title_km : (flashSale?.title || t('home.flashSale'))}
                  </span>
                </h2>
                {flashSale?.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider bg-rose-500/15 border border-rose-500/30 text-rose-300 uppercase shadow-sm">
                    {flashSale.badge}
                  </span>
                )}
              </div>
              {flashSale?.subtitle && (
                <p className="text-xs text-slate-400 mt-1">
                  {lang === 'km' && flashSale?.subtitle_km ? flashSale.subtitle_km : flashSale.subtitle}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Live Ticking Countdown Timer */}
              {flashSale?.end_time && !timeLeft.isExpired && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-rose-500/30 shadow-inner">
                  <Clock className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Ends in:</span>
                  <div className="flex items-center gap-1 font-mono text-xs font-black text-rose-400">
                    <span className="bg-slate-950 px-1.5 py-0.5 rounded border border-rose-500/20">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span>:</span>
                    <span className="bg-slate-950 px-1.5 py-0.5 rounded border border-rose-500/20">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span>:</span>
                    <span className="bg-slate-950 px-1.5 py-0.5 rounded border border-rose-500/20 text-amber-400">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              )}

              <Link
                to="/shop"
                className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1 ml-auto sm:ml-0"
              >
                <span>{t('home.viewAll')}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : featuredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Most Popular Products */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 border border-amber-500/40 flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400 animate-zap" />
            </div>
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-400 bg-clip-text text-transparent font-black">
              {t('home.popular')}
            </span>
          </h2>
          <Link
            to="/shop"
            className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>{t('home.viewAll')}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : discountProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
