import { Injectable } from '@angular/core';

import type { LayoutOptions, NavigationItem, PageContent, SeoMeta } from '@shared/types';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly navigationConfig: NavigationItem[] = [
    {
      link: '/home',
      name: 'Главная страница',
      page: {
        title: `Срочная доставка по Приморскому краю и Хабаровск`,
        description: [''],
      },
      seo: {
        title: 'Срочная доставка по Приморскому краю и Хабаровску',
        description: `Автобусная экспресс-доставка грузов и документов за 24 часа по Приморскому краю и в Хабаровск.
         Онлайн-расчёт стоимости, забор курьером, SMS-оповещения, отслеживание и нестандартные логистические решения.`,
        keywords: [
          'срочная доставка Приморский край',
          'доставка в Хабаровск',
          'экспресс доставка грузов',
          'автобусная доставка',
          'онлайн калькулятор доставки',
          'доставка документов',
          'забор курьером',
          'Баскурьер',
        ],
      },
      layout: {
        showTitle: false,
        showDescription: false,
        showBreadcrumbs: false,
      },
    },
    {
      link: 'delivery/calculator',
      name: 'Рассчитать доставку',
      page: {
        title: 'Расчет стоимости доставки',
        description: ['Рассчитайте стоимость доставки вашего груза'],
      },
      seo: {
        title: 'Калькулятор доставки — рассчитать стоимость',
        description:
          'Онлайн-калькулятор доставки: быстро узнайте стоимость и ориентировочные сроки перевозки груза по Приморью и Хабаровску.',
        keywords: [
          'калькулятор доставки',
          'рассчитать стоимость',
          'стоимость отправки',
          'тарифы',
          'Баскурьер',
          'Приморский край',
          'Хабаровск',
        ],
      },
      showInFooterMenu: true,
    },
    {
      link: 'delivery/booking',
      name: 'Оформить доставку',
      showInHeaderMenu: true,
      showInMobileMenu: true,
      showInFooterMenu: true,
    },
    {
      link: 'tracking',
      name: 'Статус доставки',
      page: {
        title: 'Статус доставки',
        description: ['Отследите местоположение вашего груза в режиме реального времени'],
      },
      seo: {
        title: 'Отслеживание отправления — статус доставки',
        description:
          'Проверьте статус отправления по номеру накладной: местоположение, этапы перевозки и дата доставки.',
        keywords: [
          'отслеживание',
          'статус доставки',
          'трекинг посылки',
          'номер накладной',
          'Баскурьер',
        ],
      },
      showInHeaderMenu: true,
      showInMobileMenu: true,
      showInFooterMenu: true,
    },
    {
      link: 'services',
      name: 'Услуги',
      page: {
        title: 'Грузоперевозки по Приморью',
        description: [
          'Ежедневные рейсы между городами Приморского края и Хабаровском.',
          'Надежно, быстро, с полным контролем на каждом этапе.',
        ],
      },
      seo: {
        title: 'Услуги доставки грузов по Приморью и Хабаровску',
        description:
          'Доставка грузов по Приморью и Хабаровску: ежедневные рейсы, курьерский забор и доставка, страхование и индивидуальные решения.',
        keywords: [
          'услуги доставки',
          'грузоперевозки',
          'Приморский край',
          'Хабаровск',
          'курьер',
          'страхование',
          'индивидуальные решения',
          'Баскурьер',
        ],
      },
      layout: {
        showTitle: false,
        showDescription: false,
        showBreadcrumbs: false,
      },
      showInHeaderMenu: true,
      showInMobileMenu: true,
      showInFooterMenu: true,
      dropdown: [
        {
          link: 'services/courier',
          name: 'Забор и доставка курьером',
          page: {
            title: 'Забор и доставка курьером',
            description: [
              'Не тратьте время на поездку — курьер заберёт посылку у вас и доставит её по адресу',
            ],
          },
          seo: {
            title: 'Курьерский забор и доставка по адресу',
            description:
              'Курьер приедет в удобное время, заберёт отправление и доставит по адресу. Удобно и без очередей.',
            keywords: [
              'курьер',
              'забор груза',
              'доставка курьером',
              'доставка по адресу',
              'Баскурьер',
            ],
          },
        },
        {
          link: 'services/complex-tasks',
          name: 'Индивидуальные решения',
          page: {
            title: 'Индивидуальные решения',
            description: ['Решение сложных логистических вопросов под ваши потребности'],
          },
          seo: {
            title: 'Индивидуальные логистические решения',
            description:
              'Нестандартные маршруты, особые требования и срочные перевозки — подберём решение под вашу задачу.',
            keywords: [
              'индивидуальные решения',
              'нестандартная логистика',
              'сложные перевозки',
              'спецзапросы',
              'Баскурьер',
            ],
          },
        },
        {
          link: 'services/insurance',
          name: 'Страхование груза',
          page: {
            title: 'Страхование груза',
            description: [
              'Мы заботимся о безопасности ваших посылок и предлагаем услугу страхования',
            ],
          },
          seo: {
            title: 'Страхование грузов — защита отправления',
            description:
              'Добровольное страхование груза на время перевозки: финансовая защита от утраты и повреждения.',
            keywords: [
              'страхование груза',
              'защита отправления',
              'безопасность',
              'компенсация убытков',
              'Баскурьер',
            ],
          },
        },
      ],
    },
    {
      link: 'info',
      name: 'Информация',
      page: {
        title: 'Информация',
        description: ['Полезная информация о работе с компанией Баскурьер'],
      },
      seo: {
        title: 'Информация для отправителей и получателей',
        description:
          'Инструкции и правила: как отправить и получить посылку, тарифы, упаковка, хранение, документы и доставка из аэропорта.',
        keywords: [
          'информация',
          'как отправить',
          'как получить',
          'правила',
          'тарифы',
          'упаковка',
          'хранение',
          'документы',
          'Баскурьер',
        ],
      },
      showInHeaderMenu: true,
      showInMobileMenu: true,
      showInFooterMenu: true,
      dropdown: [
        {
          link: 'info/how-to-send',
          name: 'Как отправить посылку',
          icon: '@tui.truck',
          badge: { text: 'Важная информация', color: 'red' },
          page: {
            title: 'Как отправить посылку',
            description: ['Подробная инструкция по отправке посылок через службу Баскурьер'],
          },
          seo: {
            title: 'Как отправить посылку — инструкция',
            description:
              'Пошагово: подготовка, оформление, упаковка, оплата и сдача груза. Советы и требования.',
            keywords: [
              'как отправить посылку',
              'инструкция',
              'оформление отправления',
              'упаковка',
              'Баскурьер',
            ],
          },
        },
        {
          link: 'info/how-to-receive',
          name: 'Как получить посылку',
          icon: '@tui.house',
          badge: { text: 'Важная информация', color: 'red' },
          page: {
            title: 'Как получить посылку',
            description: ['Инструкция по получению посылок от службы Баскурьер'],
          },
          seo: {
            title: 'Как получить посылку — инструкция',
            description:
              'Что понадобится для получения, сроки хранения, доверенности и нюансы проверки целостности.',
            keywords: [
              'как получить посылку',
              'инструкция по получению',
              'сроки хранения',
              'доверенность',
              'Баскурьер',
            ],
          },
        },
        {
          link: 'info/cargo-rules',
          name: 'Правила приемки и отправки грузов',
          icon: '@tui.scroll-text',
          badge: { text: 'Важная информация', color: 'red' },
          page: {
            title: 'Правила приемки и отправки грузов',
            description: ['Основные правила и требования для приемки и отправки грузов'],
          },
          seo: {
            title: 'Правила приемки и отправки грузов',
            description:
              'Перечень требований к упаковке, маркировке и документам. Список ограничений и рекомендаций.',
            keywords: [
              'правила отправки',
              'правила приемки',
              'требования к упаковке',
              'ограничения',
              'Баскурьер',
            ],
          },
        },
        {
          link: 'info/tariffs',
          name: 'Тарифы на доставку',
          icon: '@tui.badge-russian-ruble',
          badge: { text: 'Актуальные цены', color: 'green' },
          page: {
            title: 'Тарифы на доставку',
            description: [
              `Тарифы отличаются в зависимости от города отправления. Выберите нужный город — и ниже появятся зоны доставки и актуальные цены.`,
            ],
          },
          seo: {
            title: 'Тарифы на доставку — цены по городам отправления',
            description:
              'Актуальные тарифы на доставку грузов: выберите город отправления, чтобы увидеть зоны доставки и цены.',
            keywords: [
              'тарифы на доставку',
              'цены',
              'зоны доставки',
              'стоимость отправки',
              'Баскурьер',
            ],
          },
        },
        {
          link: 'info/packaging',
          name: 'Упаковки грузов и виды упаковки',
          icon: '@tui.package-open',
          badge: { text: 'Практические советы', color: 'yellow' },
          page: {
            title: 'Упаковки грузов и виды упаковки',
            description: ['Информация о различных видах упаковки для грузов'],
          },
          seo: {
            title: 'Упаковка грузов — виды и рекомендации',
            description:
              'Как выбрать подходящую упаковку для груза: материалы, защита, требования и советы по подготовке отправления.',
            keywords: [
              'упаковка груза',
              'виды упаковки',
              'как упаковать',
              'требования к упаковке',
              'Баскурьер',
            ],
          },
        },
        {
          link: 'info/storage',
          name: 'Хранение груза',
          icon: '@tui.warehouse',
          badge: { text: 'Полезно знать', color: 'blue' },
          page: {
            title: 'Хранение груза',
            description: ['Как мы храним ваши отправления на складе и что важно знать'],
          },
          seo: {
            title: 'Хранение грузов на складе',
            description:
              'Условия и сроки хранения отправлений на складе, правила выдачи и возможные услуги.',
            keywords: [
              'хранение груза',
              'складское хранение',
              'сроки хранения',
              'выдача',
              'Баскурьер',
            ],
          },
        },
        {
          link: 'info/documents',
          name: 'Документы',
          icon: '@tui.file-text',
          badge: { text: 'Документооборот', color: 'blue' },
          page: {
            title: 'Документы',
            description: ['Необходимые документы для отправки и получения грузов'],
          },
          seo: {
            title: 'Документы для отправки и получения',
            description:
              'Какие документы нужны отправителю и получателю: накладные, доверенности, реквизиты и образцы.',
            keywords: [
              'документы для отправки',
              'документы для получения',
              'накладная',
              'доверенность',
              'Баскурьер',
            ],
          },
        },
        {
          link: 'info/airport-delivery',
          name: 'Доставка грузов и багажа из Аэропорта',
          icon: '@tui.plane',
          badge: { text: 'Специальная услуга', color: 'green' },
          page: {
            title: 'Доставка грузов и багажа из Аэропорта',
            description: ['Услуги доставки грузов и багажа непосредственно из аэропорта'],
          },
          seo: {
            title: 'Доставка из аэропорта — багаж и грузы',
            description:
              'Заберём багаж и грузы из аэропорта и доставим по адресу: оперативно и под ключ.',
            keywords: [
              'доставка из аэропорта',
              'багаж',
              'груз из аэропорта',
              'курьер',
              'Баскурьер',
            ],
          },
        },
      ],
    },
    {
      link: 'about',
      name: 'О компании',
      page: {
        title: 'О компании',
        description: ['История, миссия и ценности компании Баскурьер'],
      },
      seo: {
        title: 'О компании Баскурьер — миссия и ценности',
        description:
          'Кто мы: история и ценности компании Баскурьер, подход к качеству и безопасности перевозок.',
        keywords: ['о компании', 'Баскурьер', 'миссия', 'ценности', 'история', 'служба доставки'],
      },
      layout: {
        showTitle: false,
        showDescription: false,
        showBreadcrumbs: false,
      },
      showInMobileMenu: true,
      showInFooterMenu: true,
    },
    {
      link: 'news',
      name: 'Новости Баскурьер',
      page: {
        title: 'Новости Баскурьер',
        description: [
          'Следите за обновлениями компании, новыми услугами и специальными предложениями',
        ],
      },
      seo: {
        title: 'Новости компании Баскурьер — обновления и акции',
        description:
          'Последние новости компании: новые направления, сервисы, акции и полезные объявления.',
        keywords: [
          'новости Баскурьер',
          'обновления',
          'акции',
          'спецпредложения',
          'служба доставки',
        ],
      },
      showInMobileMenu: true,
      showInFooterMenu: true,
    },
    {
      link: 'career',
      name: 'Работа в Баскурьер',
      page: {
        title: 'Работа в Баскурьер',
        description: [
          `Баскурьер - это единственная в России официальная служба сверхсрочной доставки
           грузов междугородними рейсовыми автобусами!`,
        ],
      },
      seo: {
        title: 'Вакансии Баскурьер — работа в службе доставки',
        description:
          'Присоединяйтесь к команде Баскурьер: открытые вакансии, условия работы и возможности роста.',
        keywords: ['вакансии', 'работа в службе доставки', 'карьерные возможности', 'Баскурьер'],
      },
      showInMobileMenu: true,
      showInFooterMenu: true,
    },
    {
      link: 'feedback',
      name: 'Обратная связь',
      page: {
        title: 'Обратная связь',
        description: [
          `Вы можете задать нам вопрос, оставить отзыв, а также написать свое предложение или замечание.`,
        ],
      },
      seo: {
        title: 'Обратная связь — задать вопрос и оставить отзыв',
        description:
          'Свяжитесь с нами: вопросы по доставке, отзывы и предложения по улучшению сервиса.',
        keywords: [
          'обратная связь',
          'написать',
          'вопрос по доставке',
          'отзыв',
          'предложение',
          'Баскурьер',
        ],
      },
      showInMobileMenu: true,
      showInFooterMenu: true,
    },
    {
      link: 'contacts',
      name: 'Контакты',
      page: {
        title: 'Контакты',
        description: ['Контактная информация и адреса офисов компании Баскурьер'],
      },
      seo: {
        title: 'Контакты',
        description:
          'Адреса офисов и пункты приёма, телефоны и время работы. Как добраться и как с нами связаться.',
        keywords: [
          'контакты',
          'адреса офисов',
          'телефоны',
          'пункты приема',
          'время работы',
          'Баскурьер',
        ],
      },
      layout: {
        showTitle: false,
        showDescription: false,
        showBreadcrumbs: false,
      },
      showInHeaderMenu: true,
      showInMobileMenu: true,
      showInFooterMenu: true,
    },
    {
      link: 'account',
      name: 'Личный кабинет',
      page: {
        title: 'Личный кабинет',
        description: ['Персональная информация, список заказов'],
      },
      seo: {
        title: 'Личный кабинет — заказы и профиль',
        description:
          'Управляйте заказами и персональными данными: история отправлений, отчёты и настройки профиля.',
        keywords: ['личный кабинет', 'мои заказы', 'профиль', 'данные пользователя', 'Баскурьер'],
      },
      showInFooterMenu: true,
      dropdown: [
        {
          link: 'account/orders',
          name: 'Мои заказы',
          icon: 'catalog',
          page: {
            title: 'Мои заказы',
            description: ['Просмотр заказов, формирование отчетов'],
          },
          seo: {
            title: 'Мои заказы — история и отчёты',
            description:
              'История отправлений, фильтрация и формирование отчётов, печать накладных и выгрузка в Excel.',
            keywords: [
              'мои заказы',
              'история отправлений',
              'отчёты',
              'накладные',
              'выгрузка в excel',
              'Баскурьер',
            ],
          },
        },
        {
          link: 'account/profile',
          name: 'Персональные данные',
          icon: 'profile',
          page: {
            title: 'Персональные данные',
            description: ['Личная информация, данные компании'],
          },
          seo: {
            title: 'Профиль — персональные и организационные данные',
            description:
              'Редактирование личных данных пользователя, реквизитов компании и контрагентов.',
            keywords: [
              'профиль',
              'персональные данные',
              'данные компании',
              'контрагенты',
              'Баскурьер',
            ],
          },
        },
      ],
    },
    {
      link: 'privacy-policy',
      name: 'Политика конфиденциальности',
      page: {
        title: 'Политика конфиденциальности',
        description: [
          'Узнайте, как компания Баскурьер собирает, использует и защищает персональные данные клиентов.',
        ],
      },
      seo: {
        title: 'Политика конфиденциальности | Баскурьер',
        description:
          'Информация о том, как Баскурьер обрабатывает и защищает персональные данные пользователей.',
        keywords: [
          'политика конфиденциальности',
          'персональные данные',
          'защита данных',
          'Баскурьер',
        ],
      },
    },
    {
      link: 'auth/login',
      name: 'Авторизация',
      page: {
        title: 'Авторизация',
      },
      seo: {
        title: 'Вход в личный кабинет',
        description: 'Авторизация для пользователей службы доставки Баскурьер.',
        keywords: ['вход', 'авторизация', 'личный кабинет', 'Баскурьер'],
      },
    },
    {
      link: 'auth/register',
      name: 'Авторизация',
      page: {
        title: 'Регистрация',
      },
      seo: {
        title: 'Регистрация аккаунта',
        description: 'Создайте личный кабинет для оформления и отслеживания доставок.',
        keywords: ['регистрация', 'новый аккаунт', 'личный кабинет', 'Баскурьер'],
      },
    },
    {
      link: 'auth/forgot-password',
      name: 'Восстановление пароля',
      page: {
        title: 'Восстановление пароля',
      },
      seo: {
        title: 'Восстановление пароля',
        description: 'Форма для восстановления доступа к личному кабинету Баскурьер.',
        keywords: ['восстановление пароля', 'личный кабинет', 'Баскурьер'],
      },
    },
  ];

  getNavigation(): NavigationItem[] {
    return this.navigationConfig;
  }

  getHeaderNavigation(): NavigationItem[] {
    return this.navigationConfig.filter((item) => item.showInHeaderMenu);
  }

  getMobileNavigation(): NavigationItem[] {
    return this.navigationConfig.filter((item) => item.showInMobileMenu);
  }

  getFooterNavigation(): NavigationItem[] {
    return this.navigationConfig.filter((item) => item.showInFooterMenu);
  }

  findByLink(link: string): NavigationItem | null {
    // Search in root elements
    let found = this.navigationConfig.find((item) => item.link === link);
    if (found) return found;

    // Search in dropdown elements
    for (const item of this.navigationConfig) {
      if (item.dropdown) {
        found = item.dropdown.find((subItem) => subItem.link === link);
        if (found) return found;
      }
    }

    if (!found) {
      // Search by the end of path
      found = this.navigationConfig.find(
        (item) => item.link.endsWith(`/${link}`) || item.link === link,
      );

      if (!found) {
        // Search by the end of path in dropdown
        for (const item of this.navigationConfig) {
          if (item.dropdown) {
            found = item.dropdown.find(
              (subItem) => subItem.link.endsWith(`/${link}`) || subItem.link === link,
            );
            if (found) break;
          }
        }
      }
    }

    return found || null;
  }

  getDropdownItems(parentLink: string): NavigationItem[] {
    const parent = this.findByLink(parentLink);
    return parent?.dropdown || [];
  }

  getPageContent(link: string): PageContent {
    const item = this.findByLink(link);
    if (!item) return { title: '' };

    return {
      title: item.page?.title || item.name,
      description: item.page?.description,
    };
  }

  getSeoMeta(link: string): SeoMeta {
    const item = this.findByLink(link);
    if (!item) return {};

    const pageContent = this.getPageContent(link);

    return {
      title: item.seo?.title || pageContent.title,
      description: item.seo?.description || pageContent.description?.join(' '),
      keywords: item.seo?.keywords,
      image: item.seo?.image,
      url: item.seo?.url,
    };
  }

  getLayoutOptions(link: string): LayoutOptions {
    const item = this.findByLink(link);

    return (
      item?.layout ?? {
        showTitle: true,
        showDescription: true,
        showBreadcrumbs: false,
      }
    );
  }

  /**
   * For sitemap, search...
   */
  getAllPages(): NavigationItem[] {
    const allPages: NavigationItem[] = [];

    for (const item of this.navigationConfig) {
      allPages.push(item);
      if (item.dropdown) {
        allPages.push(...item.dropdown);
      }
    }

    return allPages;
  }
}
