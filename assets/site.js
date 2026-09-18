'use strict';

(() => {
  const translations = [...document.querySelectorAll('[data-en]')].map(element => ({element, zh: element.innerHTML, en: element.dataset.en}));
  const attributeTranslations = [...document.querySelectorAll('[data-en-alt], [data-en-aria]')].flatMap(element => {
    const entries = [];
    if (element.dataset.enAlt) entries.push({element, attribute: 'alt', zh: element.getAttribute('alt'), en: element.dataset.enAlt});
    if (element.dataset.enAria) entries.push({element, attribute: 'aria-label', zh: element.getAttribute('aria-label'), en: element.dataset.enAria});
    return entries;
  });
  const screens = {
    customer: {
      file: '02-customer-services.png', width: 1440, height: 1521,
      zh: ['先了解服务，再安排时间。', '展示服务说明、参考价格与适用条件。预约统一收集服务时段、联系人、常用地址与问题照片。', '客户网页 · 服务浏览与预约', '客户服务目录'],
      en: ['Find the right service. Choose a time.', 'Service descriptions, indicative prices and conditions help customers book. Appointment slots, contact details, saved addresses and problem photos stay together.', 'Customer web · service catalog and booking', 'Customer service catalog']
    },
    worker: {
      file: '04-worker-tasks.png', width: 1440, height: 1050,
      zh: ['任务有归属，处理有记录。', '工作人员查看本人任务，接单或退回，记录进展与现场照片，并在处理完成后提交客户验收。', '人员网页 · 本人任务与处理记录', '工作人员任务列表'],
      en: ['Clear ownership. Recorded progress.', 'Technicians see their assigned tasks, accept or return work, add progress notes and onsite photos, and submit completed work for customer sign-off.', 'Technician web · assigned tasks and service records', 'Technician task list']
    },
    acceptance: {
      file: '05-completed-order.png', width: 1440, height: 1636,
      zh: ['交付完成，由客户确认。', '客户查看处理结果与完整进展，确认验收后提交星级与文字评价，为服务形成可追踪的反馈。', '客户网页 · 完成订单与验收评价', '已完成订单详情与客户评价'],
      en: ['Delivery ends with customer sign-off.', 'Customers inspect the results and progress history, accept the completed work, then leave a star rating and written review.', 'Customer web · completed order and review', 'Completed order details and customer review']
    },
    mobile: {
      file: '08-mobile-services.png', width: 390, height: 844,
      zh: ['离开桌面，也能跟进业务。', '客户服务目录与管理概览均适配手机网页。图中是响应式网页；独立微信小程序已完成离线编译，尚未公开发布。', '手机网页 · 客户服务目录与管理概览', '手机网页客户服务目录'],
      en: ['Stay connected beyond the desk.', 'The catalog and management dashboard adapt to mobile browsers. These are responsive web screens; the separate WeChat client has passed offline compilation and is not publicly released.', 'Mobile web · customer catalog and management dashboard', 'Customer service catalog on mobile web']
    }
  };
  let language = 'zh';
  let selectedScreen = 'customer';
  const languageButton = document.getElementById('language-button');
  const screenImage = document.getElementById('screen-image');
  const screenButtons = [...document.querySelectorAll('[data-screen]')];

  function updateScreen() {
    const screen = screens[selectedScreen];
    const [title, description, caption, alt] = screen[language];
    document.getElementById('screen-title').textContent = title;
    document.getElementById('screen-description').textContent = description;
    document.getElementById('screen-caption').textContent = caption;
    screenImage.src = `assets/screenshots/${screen.file}`;
    screenImage.width = screen.width;
    screenImage.height = screen.height;
    screenImage.alt = alt;
    document.getElementById('screen-original').href = `assets/screenshots/${screen.file}`;
    document.getElementById('gallery-preview').classList.toggle('mobile', selectedScreen === 'mobile');
    document.getElementById('mobile-admin-image').hidden = selectedScreen !== 'mobile';
    screenButtons.forEach(button => {
      const active = button.dataset.screen === selectedScreen;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function setLanguage(nextLanguage) {
    language = nextLanguage === 'en' ? 'en' : 'zh';
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
    translations.forEach(({element, zh, en}) => {
      if (language === 'en') element.textContent = en;
      else element.innerHTML = zh;
    });
    attributeTranslations.forEach(({element, attribute, zh, en}) => element.setAttribute(attribute, language === 'en' ? en : zh));
    languageButton.textContent = language === 'en' ? '中文 ↗' : 'EN ↗';
    languageButton.setAttribute('aria-label', language === 'en' ? '切换到中文' : 'Switch to English');
    document.title = language === 'en' ? 'ServiceFlow · Service booking & work order portfolio' : '知修 ServiceFlow · 服务预约与工单交付展示';
    document.querySelector('meta[name="description"]').content = language === 'en' ? 'ServiceFlow: a complete service booking, work order and customer sign-off project. Explore actual screens, a workflow recording, technology and delivery scope.' : '知修 ServiceFlow：服务预约、工单协作与客户验收的完整项目展示。查看真实界面、业务录像、技术方案与合作范围。';
    updateScreen();
    try { localStorage.setItem('serviceflow-language', language); } catch (_) { /* Language switching also works without storage access. */ }
  }

  screenButtons.forEach(button => button.addEventListener('click', () => {
    selectedScreen = button.dataset.screen;
    updateScreen();
  }));
  languageButton.addEventListener('click', () => setLanguage(language === 'en' ? 'zh' : 'en'));
  let savedLanguage = 'zh';
  try { savedLanguage = localStorage.getItem('serviceflow-language') || 'zh'; } catch (_) { /* Use the default language. */ }
  setLanguage(savedLanguage);
})();
