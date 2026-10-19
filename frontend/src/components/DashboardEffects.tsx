'use client';

import { AnimatedWrapper, GlowEffect, TiltCard } from './AnimatedWrapper';
import { ModernCard, MasonryGrid, FloatingAction } from './ModernCard';
import { ProfessionalButton, MagneticButton } from './ProfessionalButton';
import { Badge, ProgressBar, Skeleton } from './ProfessionalEffects';
import { Plus, Sparkles, TrendingUp, Heart, MapPin, Calendar, Camera } from 'lucide-react';

export function DashboardHero() {
  return (
    <AnimatedWrapper animation="fade-in-down" className="mb-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 p-8 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2 animate-fade-in">
            Chào mừng trở lại! 👋
          </h1>
          <p className="text-lg opacity-90 animate-fade-in" style={{ animationDelay: '200ms' }}>
            Hãy bắt đầu ngày mới với những kỷ niệm tuyệt vời
          </p>
          <div className="mt-6 flex gap-3">
            <MagneticButton>
              <Sparkles className="w-5 h-5 mr-2" />
              Tạo kỷ niệm mới
            </MagneticButton>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
      </div>
    </AnimatedWrapper>
  );
}

export function StatsCards() {
  const stats = [
    { label: 'Tổng kỷ niệm', value: 124, icon: <MapPin className="w-6 h-6" />, color: 'blue' },
    { label: 'Địa điểm', value: 45, icon: <MapPin className="w-6 h-6" />, color: 'purple' },
    { label: 'Ảnh', value: 892, icon: <Camera className="w-6 h-6" />, color: 'pink' },
    { label: 'Yêu thích', value: 67, icon: <Heart className="w-6 h-6" />, color: 'red' },
  ];

  return (
    <MasonryGrid columns={4} gap={4}>
      {stats.map((stat, index) => (
        <AnimatedWrapper
          key={stat.label}
          animation="fade-in-up"
          delay={index * 100}
        >
          <TiltCard maxTilt={10}>
            <ModernCard
              title={stat.value.toString()}
              description={stat.label}
              variant="default"
              size="sm"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                {stat.icon}
              </div>
            </ModernCard>
          </TiltCard>
        </AnimatedWrapper>
      ))}
    </MasonryGrid>
  );
}

export function RecentMemories() {
  const memories = [
    {
      title: 'Chuyến đi Đà Lạt',
      description: 'Một kỳ nghỉ tuyệt vời với gia đình',
      image: 'https://images.unsplash.com/photo-1569686053339-6686a7e4d7b0?w=400',
      badge: 'Mới',
    },
    {
      title: 'Sinh nhật 25 tuổi',
      description: 'Tiệc cùng bạn bè thân thiết',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400',
      badge: 'Yêu thích',
    },
    {
      title: 'Leo núi Fansipan',
      description: 'Chinh phục đỉnh cao Đông Dương',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400',
    },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white animate-fade-in">
        Kỷ niệm gần đây
      </h2>
      <MasonryGrid columns={3} gap={4}>
        {memories.map((memory, index) => (
          <AnimatedWrapper
            key={memory.title}
            animation="fade-in-up"
            delay={index * 150}
          >
            <GlowEffect color="purple" intensity="medium">
              <ModernCard
                title={memory.title}
                description={memory.description}
                image={memory.image}
                badge={memory.badge}
                variant="default"
              />
            </GlowEffect>
          </AnimatedWrapper>
        ))}
      </MasonryGrid>
    </div>
  );
}

export function QuickActions() {
  const actions = [
    { label: 'Thêm mới', icon: <Plus className="w-5 h-5" />, color: 'primary' },
    { label: 'Thống kê', icon: <TrendingUp className="w-5 h-5" />, color: 'success' },
    { label: 'Lịch', icon: <Calendar className="w-5 h-5" />, color: 'warning' },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white animate-fade-in">
        Hành động nhanh
      </h2>
      <div className="flex gap-3 flex-wrap">
        {actions.map((action, index) => (
          <AnimatedWrapper
            key={action.label}
            animation="fade-in-up"
            delay={index * 100}
          >
            <ProfessionalButton
              variant={action.color as any}
              icon={action.icon}
              iconPosition="left"
            >
              {action.label}
            </ProfessionalButton>
          </AnimatedWrapper>
        ))}
      </div>
    </div>
  );
}

export function ProgressSection() {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white animate-fade-in">
        Tiến độ của bạn
      </h2>
      <AnimatedWrapper animation="fade-in-up">
        <ModernCard
          title="Mục tiêu kỷ niệm"
          description="Bạn đã hoàn thành 75% mục tiêu tháng này"
          variant="default"
        >
          <div className="space-y-4">
            <ProgressBar value={75} max={100} color="success" showLabel />
            <div className="flex items-center justify-between">
              <Badge variant="success">Đang tiến bộ</Badge>
              <span className="text-sm text-slate-600 dark:text-slate-400">75/100</span>
            </div>
          </div>
        </ModernCard>
      </AnimatedWrapper>
    </div>
  );
}

export function DashboardFloatingAction() {
  return (
    <FloatingAction
      icon={<Plus className="w-6 h-6" />}
      onClick={() => {}}
      position="bottom-right"
      color="primary"
    />
  );
}
