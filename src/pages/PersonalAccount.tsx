import React, { useState } from 'react';
import { useAuth, SUBSCRIPTION_PLANS } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  User,
  CreditCard,
  Users,
  TrendingUp,
  Calendar,
  Award,
  Target,
  Clock,
  BookOpen,
  BarChart3,
  Crown,
  Plus,
  X,
  CheckCircle,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

const PersonalAccount = () => {
  const { user, updateSubscription, addFamilyMember, removeFamilyMember, logout } = useAuth();
  const navigate = useNavigate();
  const [isAddingFamilyMember, setIsAddingFamilyMember] = useState(false);
  const [newMemberData, setNewMemberData] = useState({
    name: '',
    age: '',
    courses: [] as string[]
  });

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleAddFamilyMember = async () => {
    if (!newMemberData.name || !newMemberData.age) return;

    await addFamilyMember({
      name: newMemberData.name,
      age: parseInt(newMemberData.age),
      courses: newMemberData.courses
    });

    setNewMemberData({ name: '', age: '', courses: [] });
    setIsAddingFamilyMember(false);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getCurrentPlan = () => user.subscription?.plan || SUBSCRIPTION_PLANS[0];

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1">
                <TabsTrigger value="overview">Обзор</TabsTrigger>
                <TabsTrigger value="progress">Прогресс</TabsTrigger>
                <TabsTrigger value="subscription">Подписка</TabsTrigger>
                <TabsTrigger value="family">Семья</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Профиль пользователя
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Имя</Label>
                        <p className="text-lg font-medium">{user.name}</p>
                      </div>
                      <div>
                        <Label>Email</Label>
                        <p className="text-lg font-medium">{user.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Уровень знаний</Label>
                        <Badge variant="secondary">
                          {user.knowledgeLevel === 'beginner' ? 'Начинающий' :
                           user.knowledgeLevel === 'intermediate' ? 'Средний' : 'Продвинутый'}
                        </Badge>
                      </div>
                      <div>
                        <Label>Текущий тариф</Label>
                        <Badge variant="default" className="flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          {getCurrentPlan().name}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Курсы</p>
                          <p className="text-2xl font-bold">{user.stats?.activeCourses || 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Завершено</p>
                          <p className="text-2xl font-bold">{user.stats?.completedModules || 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Часы обучения</p>
                          <p className="text-2xl font-bold">{user.stats?.studyTimeHours || 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Достижения</p>
                          <p className="text-2xl font-bold">{user.stats?.achievements || 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Progress Tab */}
              <TabsContent value="progress" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Прогресс обучения
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Общий прогресс</Label>
                        <span className="text-sm font-medium">{user.stats?.averageProgress || 0}%</span>
                      </div>
                      <Progress value={user.stats?.averageProgress || 0} className="h-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Активные курсы</h4>
                        {user.activeCourses && user.activeCourses.length > 0 ? (
                          <div className="space-y-3">
                            {user.activeCourses.map((course) => (
                              <div key={course.id} className="p-3 border rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-medium">{course.title}</h5>
                                  <Badge variant="outline">{course.level}</Badge>
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                                  <span>{course.completedModules} из {course.modules} модулей</span>
                                  <span>{course.progress}%</span>
                                </div>
                                <Progress value={course.progress} className="h-1" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">Нет активных курсов</p>
                        )}
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Статистика за неделю</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Время обучения</span>
                            <span className="text-sm font-medium">0 ч</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Завершенные уроки</span>
                            <span className="text-sm font-medium">0</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Средний балл</span>
                            <span className="text-sm font-medium">0%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Subscription Tab */}
              <TabsContent value="subscription" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Текущая подписка
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold text-lg">{getCurrentPlan().name}</h3>
                        <p className="text-muted-foreground">{formatCurrency(getCurrentPlan().price, getCurrentPlan().currency)}/месяц</p>
                      </div>
                      <Badge variant={user.subscription?.isActive ? "default" : "secondary"}>
                        {user.subscription?.isActive ? "Активна" : "Неактивна"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Доступные тарифы</CardTitle>
                    <CardDescription>Выберите подходящий план для ваших нужд</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {SUBSCRIPTION_PLANS.map((plan) => (
                        <div key={plan.id} className={`p-4 border rounded-lg ${user.subscription?.planId === plan.id ? 'border-primary bg-primary/5' : ''}`}>
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold">{plan.name}</h4>
                              <p className="text-2xl font-bold">{formatCurrency(plan.price, plan.currency)}<span className="text-sm font-normal">/месяц</span></p>
                            </div>
                            {user.subscription?.planId === plan.id && (
                              <Badge variant="default">Текущий</Badge>
                            )}
                          </div>

                          <ul className="space-y-1 mb-4">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="text-sm flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>

                          {user.subscription?.planId !== plan.id && (
                            <Button
                              onClick={() => updateSubscription(plan.id)}
                              className="w-full"
                              variant={plan.price === 0 ? "outline" : "default"}
                            >
                              {plan.price === 0 ? "Выбрать" : "Перейти на тариф"}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Family Tab */}
              <TabsContent value="family" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Семейные аккаунты
                    </CardTitle>
                    <CardDescription>
                      Управляйте аккаунтами членов семьи ({user.familyMembers?.length || 0} из {getCurrentPlan().maxFamilyMembers})
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user.familyMembers && user.familyMembers.length > 0 ? (
                      <div className="space-y-3">
                        {user.familyMembers.map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <h4 className="font-medium">{member.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {member.age} лет • Курсы: {member.courses.join(', ') || 'Не выбраны'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Логин: {member.username}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFamilyMember(member.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        Пока нет членов семьи
                      </p>
                    )}

                    {user.familyMembers && user.familyMembers.length < getCurrentPlan().maxFamilyMembers && (
                      <Dialog open={isAddingFamilyMember} onOpenChange={setIsAddingFamilyMember}>
                        <DialogTrigger asChild>
                          <Button className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            Добавить члена семьи
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Добавить члена семьи</DialogTitle>
                            <DialogDescription>
                              Создайте аккаунт для члена семьи с автоматической генерацией логина и пароля
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="name">Имя</Label>
                              <Input
                                id="name"
                                value={newMemberData.name}
                                onChange={(e) => setNewMemberData({...newMemberData, name: e.target.value})}
                                placeholder="Введите имя"
                              />
                            </div>
                            <div>
                              <Label htmlFor="age">Возраст</Label>
                              <Input
                                id="age"
                                type="number"
                                value={newMemberData.age}
                                onChange={(e) => setNewMemberData({...newMemberData, age: e.target.value})}
                                placeholder="Введите возраст"
                              />
                            </div>
                            <div>
                              <Label>Курсы для изучения</Label>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {['Русский', 'Английский', 'Математика', 'Физика'].map((course) => (
                                  <Button
                                    key={course}
                                    variant={newMemberData.courses.includes(course) ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => {
                                      const courses = newMemberData.courses.includes(course)
                                        ? newMemberData.courses.filter(c => c !== course)
                                        : [...newMemberData.courses, course];
                                      setNewMemberData({...newMemberData, courses});
                                    }}
                                  >
                                    {course}
                                  </Button>
                                ))}
                              </div>
                            </div>
                            <Button
                              onClick={handleAddFamilyMember}
                              disabled={!newMemberData.name || !newMemberData.age}
                              className="w-full"
                            >
                              Создать аккаунт
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Статистика
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {user.performanceMetrics?.averageScore || 0}%
                  </div>
                  <p className="text-sm text-muted-foreground">Средний балл</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold">{user.performanceMetrics?.totalStudyTime || 0}</div>
                    <p className="text-xs text-muted-foreground">Минут обучения</p>
                  </div>
                  <div>
                    <div className="text-xl font-bold">{user.performanceMetrics?.streakDays || 0}</div>
                    <p className="text-xs text-muted-foreground">Дней подряд</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Недавние достижения
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Достижения появятся здесь</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalAccount;
