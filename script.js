(() => {
  const quizForm = document.querySelector('#quiz-form');
  const steps = [...document.querySelectorAll('.quiz-step')];
  const progressLabel = document.querySelector('#quiz-progress-label');
  const progressBar = document.querySelector('#quiz-progress-bar');
  const controls = document.querySelector('#quiz-controls');
  const nextButton = document.querySelector('#quiz-next');
  const backButton = document.querySelector('#quiz-back');
  const result = document.querySelector('#quiz-result');
  const resultTitle = document.querySelector('#result-title');
  const resultText = document.querySelector('#result-text');
  const restartButton = document.querySelector('#restart-quiz');
  let currentStep = 0;

  const recommendations = {
    tasks: {
      title: 'Начните с управления задачами',
      text: 'Соберите задачи в общие проекты, назначьте ответственных и договоритесь о правилах сроков. Затем подключайте автоматические напоминания и регулярный обзор прогресса.'
    },
    sales: {
      title: 'Начните с CRM и заявок',
      text: 'Опишите путь клиента от первого обращения до сделки. Зафиксируйте этапы, ответственных и следующий шаг — так команда сможет видеть, где находится каждая возможность.'
    },
    comms: {
      title: 'Начните с единого контекста',
      text: 'Свяжите обсуждения с задачами и проектами, договоритесь, где хранить решения и файлы. Цель — чтобы важная информация не терялась в отдельных чатах.'
    }
  };

  function showStep(index) {
    currentStep = index;
    steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
    progressLabel.textContent = `ВОПРОС ${index + 1} ИЗ ${steps.length}`;
    progressBar.style.width = `${((index + 1) / steps.length) * 100}%`;
    backButton.disabled = index === 0;
    nextButton.innerHTML = index === steps.length - 1 ? 'Получить рекомендацию <span>↗</span>' : 'Далее <span>→</span>';
  }

  nextButton.addEventListener('click', () => {
    const activeStep = steps[currentStep];
    const selected = activeStep.querySelector('input[type="radio"]:checked');
    if (!selected) {
      const firstInput = activeStep.querySelector('input[type="radio"]');
      firstInput.focus();
      activeStep.classList.add('needs-answer');
      activeStep.querySelector('legend').setAttribute('aria-live', 'polite');
      activeStep.querySelector('legend').textContent = 'Выберите один вариант, чтобы продолжить';
      return;
    }
    if (currentStep < steps.length - 1) {
      showStep(currentStep + 1);
      return;
    }
    const pain = quizForm.querySelector('input[name="pain"]:checked')?.value || 'tasks';
    const team = quizForm.querySelector('input[name="team"]:checked')?.value;
    const goal = quizForm.querySelector('input[name="goal"]:checked')?.value;
    const recommendation = recommendations[pain];
    resultTitle.textContent = recommendation.title;
    let extra = '';
    if (team === 'large') extra = ' Для большой команды дополнительно зафиксируйте единые правила и права доступа.';
    else if (team === 'small') extra = ' Начните с простого сценария, который команда сможет освоить без долгого внедрения.';
    if (goal === 'speed') extra += ' Выберите один повторяющийся процесс и проверьте, можно ли убрать из него ручные шаги.';
    if (goal === 'growth') extra += ' Сразу документируйте процесс, чтобы его было легче масштабировать.';
    resultText.textContent = recommendation.text + extra;
    steps.forEach(step => step.hidden = true);
    controls.hidden = true;
    result.hidden = false;
    progressLabel.textContent = 'РЕКОМЕНДАЦИЯ ГОТОВА';
    progressBar.style.width = '100%';
  });

  backButton.addEventListener('click', () => {
    if (currentStep > 0) showStep(currentStep - 1);
  });

  restartButton.addEventListener('click', () => {
    quizForm.reset();
    steps.forEach(step => {
      step.hidden = false;
      step.classList.remove('needs-answer');
      const index = Number(step.dataset.step);
      const legends = [
        'Что сейчас отнимает больше всего времени?',
        'Сколько человек в вашей команде?',
        'Какой результат важнее в ближайший месяц?'
      ];
      step.querySelector('legend').textContent = legends[index];
    });
    result.hidden = true;
    controls.hidden = false;
    showStep(0);
  });

  quizForm.addEventListener('change', (event) => {
    if (event.target.matches('input[type="radio"]')) {
      event.target.closest('.quiz-step')?.classList.remove('needs-answer');
    }
  });

  const leadForm = document.querySelector('#lead-form');
  const success = document.querySelector('#form-success');
  leadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!leadForm.reportValidity()) return;
    success.hidden = false;
    success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    leadForm.querySelector('button[type="submit"]').textContent = 'Демонстрация отправлена ✓';
  });

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
})();
