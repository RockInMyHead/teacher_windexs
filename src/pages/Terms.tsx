import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/auth')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Пользовательское соглашение</CardTitle>
            <CardDescription>
              Правила использования платформы Windexs-Учитель
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <h3>1. Общие положения</h3>
            <p>
              Настоящее пользовательское соглашение (далее — «Соглашение») регулирует отношения
              между владельцем платформы Windexs-Учитель (далее — «Платформа») и пользователем
              услуг платформы (далее — «Пользователь»).
            </p>

            <h3>2. Предмет соглашения</h3>
            <p>
              Платформа предоставляет образовательные услуги с использованием искусственного интеллекта,
              включая персонализированное обучение, тестирование и интерактивный чат с AI-преподавателем.
            </p>

            <h3>3. Права и обязанности пользователя</h3>
            <p><strong>Пользователь имеет право:</strong></p>
            <ul>
              <li>Получать доступ к образовательному контенту платформы</li>
              <li>Использовать AI-помощника для обучения</li>
              <li>Проходить тестирование и получать персонализированные рекомендации</li>
            </ul>

            <p><strong>Пользователь обязуется:</strong></p>
            <ul>
              <li>Предоставлять достоверную информацию при регистрации</li>
              <li>Не нарушать законодательство при использовании платформы</li>
              <li>Не передавать свои учетные данные третьим лицам</li>
              <li>Использовать платформу только в образовательных целях</li>
            </ul>

            <h3>4. Права и обязанности платформы</h3>
            <p>
              Платформа обязуется обеспечивать стабильную работу сервисов, защиту персональных данных
              пользователей и постоянное улучшение качества образовательного контента.
            </p>

            <h3>5. Ограничение ответственности</h3>
            <p>
              Платформа не несет ответственности за косвенные убытки, упущенную выгоду или любые
              другие косвенные потери пользователя.
            </p>

            <h3>6. Изменения в соглашении</h3>
            <p>
              Платформа оставляет за собой право вносить изменения в настоящее соглашение.
              Пользователи будут уведомлены о существенных изменениях.
            </p>

            <h3>7. Контактная информация</h3>
            <p>
              По вопросам, связанным с настоящим соглашением, обращайтесь по адресу support@windexs.ru
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;












