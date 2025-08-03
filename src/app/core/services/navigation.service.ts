import { Injectable } from '@angular/core';
import type { Route } from '@angular/router';

import type { NavigationItem } from '@shared/types';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly navigationConfig: NavigationItem[] = [
    {
      link: 'tracking',
      name: 'Статус доставки',
      description: 'Отследите местоположение вашего груза в режиме реального времени',
      keywords: 'статус доставки, отслеживание, трекинг',
    },
    {
      link: 'delivery',
      name: 'Предварительный расчет',
      description: 'Рассчитайте стоимость доставки вашего груза',
      keywords: 'расчет стоимости, калькулятор доставки',
    },
    {
      link: 'services',
      name: 'Услуги',
      description: '',
      keywords: 'услуги доставки, логистика, грузоперевозки',
      dropdown: [
        // {
        //   link: 'services/cargo-primorye',
        //   name: 'Грузоперевозки по Приморскому краю',
        //   description: 'Надежная доставка грузов по всему Приморскому краю',
        //   keywords: 'грузоперевозки, приморский край, доставка',
        // },
        {
          link: 'services/courier',
          name: 'Забор и доставка курьером',
          description: 'Курьерская служба для забора и доставки ваших отправлений',
          keywords: 'курьер, забор груза, доставка курьером',
        },
        {
          link: 'services/complex-tasks',
          name: 'Реализация нестандартных логистических задач',
          description: 'Решение сложных логистических вопросов под ваши потребности',
          keywords: 'нестандартная логистика, сложные задачи',
        },
        {
          link: 'services/insurance',
          name: 'Страхование груза',
          description: [
            `Мы заботимся о безопасности ваших посылок и предлагаем услугу страхования
             — она помогает компенсировать убытки, если с грузом что‑то случится.`,
          ],
          keywords: 'страхование груза, защита, безопасность',
        },
      ],
    },
    {
      link: 'info',
      name: 'Информация',
      description: 'Полезная информация о работе с компанией Баскурьер',
      keywords: 'информация, справка, инструкции',
      dropdown: [
        {
          link: 'info/how-to-send',
          name: 'Как отправить посылку',
          description: 'Подробная инструкция по отправке посылок через службу Баскурьер',
          keywords: 'отправить посылку, инструкция, доставка',
          icon: '@tui.truck',
          badge: {
            text: 'Важная информация',
            color: 'red',
          },
        },
        {
          link: 'info/how-to-receive',
          name: 'Как получить посылку',
          description: 'Инструкция по получению посылок от службы Баскурьер',
          keywords: 'получить посылку, инструкция, получение',
          icon: '@tui.house',
          badge: {
            text: 'Важная информация',
            color: 'red',
          },
        },
        {
          link: 'info/cargo-rules',
          name: 'Правила приемки и отправки грузов',
          description: 'Основные правила и требования для приемки и отправки грузов',
          keywords: 'правила, грузы, приемка, отправка',
          icon: '@tui.scroll-text',
          badge: {
            text: 'Важная информация',
            color: 'red',
          },
        },
        {
          link: 'info/tariffs',
          name: 'Тарифы на доставку',
          description: [
            `Тарифы отличаются в зависимости от города отправления. Выберите нужный город — и ниже
            появятся зоны доставки и актуальные цены.`,
          ],
          keywords: 'тарифы, стоимость доставки, расценки, баскурьер',
          icon: '@tui.badge-russian-ruble',
          badge: {
            text: 'Актуальные цены',
            color: 'green',
          },
        },
        {
          link: 'info/packaging',
          name: 'Упаковки грузов и виды упаковки',
          description: 'Информация о различных видах упаковки для грузов',
          keywords: 'упаковка, грузы, виды упаковки',
          icon: '@tui.package-open',
          badge: {
            text: 'Практические советы',
            color: 'yellow',
          },
        },
        {
          link: 'info/storage',
          name: 'Хранение груза',
          description: 'Как мы храним ваши отправления на складе и что важно знать',
          keywords: 'хранение, склад, условия',
          icon: '@tui.warehouse',
          badge: {
            text: 'Полезно знать',
            color: 'blue',
          },
        },
        {
          link: 'info/documents',
          name: 'Документы',
          description: 'Необходимые документы для отправки и получения грузов',
          keywords: 'документы, оформление, требования',
          icon: '@tui.file-text',
          badge: {
            text: 'Документооборот',
            color: 'blue',
          },
        },
        {
          link: 'info/airport-delivery',
          name: 'Доставка грузов и багажа из Аэропорта',
          description: 'Услуги доставки грузов и багажа непосредственно из аэропорта',
          keywords: 'аэропорт, доставка, багаж, грузы',
          icon: '@tui.plane',
          badge: {
            text: 'Специальная услуга',
            color: 'green',
          },
        },
      ],
    },
    {
      link: 'about',
      name: 'О компании',
      description: 'История, миссия и ценности компании Баскурьер',
      keywords: 'о компании, история, миссия',
      onlyMobile: true,
    },
    {
      link: 'news',
      name: 'Новости Баскурьер',
      description: 'Следите за обновлениями компании, новыми услугами и специальными предложениями',
      keywords: 'Новости, акции, специальные предложения',
      onlyMobile: true,
    },
    {
      link: 'career',
      name: 'Вакансии',
      description: 'Открытые вакансии и карьерные возможности в Баскурьер',
      keywords: 'вакансии, работа, карьера',
      onlyMobile: true,
    },
    {
      link: 'feedback',
      name: 'Обратная связь',
      description: 'Свяжитесь с нами для получения консультации',
      keywords: 'обратная связь, контакты, консультация',
      onlyMobile: true,
    },
    {
      link: 'contacts',
      name: 'Контакты',
      description: 'Контактная информация и адреса офисов компании Баскурьер',
      keywords: 'контакты, адреса, телефоны',
    },
    {
      link: 'account',
      name: 'Личный кабинет',
      description: 'Персональная информация, список заказв',
      keywords: 'личные данные, данные организации, спискок заков',
      dropdown: [
        {
          link: 'account/orders',
          name: 'Мои заказы',
          icon: 'catalog',
          description: 'Просмотри заказов, формаирование отчетов',
          keywords: 'просмотр, фильтрация, генерация накладных, сортировка, выгрузка в excel',
        },
        {
          link: 'account/profile',
          name: 'Персональные данные',
          icon: 'profile',
          description: 'Личная информация, данные компании',
          keywords: 'данные пользователя, данные компании, контрагенты',
        },
      ],
    },
  ];

  getNavigation(): NavigationItem[] {
    return this.navigationConfig;
  }

  getDesktopNavigation(): NavigationItem[] {
    return this.navigationConfig.filter((item) => !item.onlyMobile && item.link !== 'account');
  }

  getMobileNavigation(): NavigationItem[] {
    return this.navigationConfig;
  }

  // findByLink(link: string): NavigationItem | null {
  //   // Поиск в корневых элементах
  //   let found = this.navigationConfig.find(item => item.link === link);
  //   if (found) return found;
  //
  //   // Поиск в dropdown элементах
  //   for (const item of this.navigationConfig) {
  //     if (item.dropdown) {
  //       found = item.dropdown.find(subItem => subItem.link === link);
  //       if (found) return found;
  //     }
  //   }
  //
  //   return null;
  // }

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

  getSeoDataByLink(
    link: string,
  ): { title: string; description?: string | string[]; keywords?: string } | null {
    const item = this.findByLink(link);
    if (!item) return null;

    return {
      title: item.name,
      description: item.description,
      keywords: item.keywords,
    };
  }

  getBreadcrumbsForLink(link: string): { name: string; link: string }[] {
    const breadcrumbs: { name: string; link: string }[] = [];

    // Search parent node
    for (const item of this.navigationConfig) {
      if (item.dropdown) {
        const childItem = item.dropdown.find((child) => child.link === link);
        if (childItem) {
          breadcrumbs.push({ name: item.name, link: item.link });
          breadcrumbs.push({ name: childItem.name, link: childItem.link });
          break;
        }
      } else if (item.link === link) {
        breadcrumbs.push({ name: item.name, link: item.link });
        break;
      }
    }

    return breadcrumbs;
  }

  generateRoutesForSection(sectionLink: string): Route[] {
    const section = this.findByLink(sectionLink);
    if (!section?.dropdown) return [];

    return section.dropdown.map((item) => ({
      path: item.link.replace(`${sectionLink}/`, ''),
      data: {
        pageKey: item.link.replace('/', '-'),
        title: item.name,
        description: item.description,
        keywords: item.keywords,
      },
    }));
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
