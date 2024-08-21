export interface DataToUpload {
  // данные о самих привычках
  habits: Habit[];

  // данные о выполнении
  actions: HabitAction[];
}

export type Period = 'daily' | 'weekly' | 'monthly';

export interface Habit {
  // у каждой привычки уникальный id
  id: number;

  title: string;

  category: string;

  // дата, начиная с которой Вася трекает эту привычку
  addDate: Date;

  period: Period;

  // необязательное поле – целевое значение для численных привычек,
  // например, пройти 10000 шагов
  targetValue?: number;

  // это уже я добавил
  actions: HabitAction[];
  isArchived?: boolean;
}

export interface HabitAction {
  // id привычки, чтобы связать с объектами Habit
  id: number;

  // дата и время, когда это действие отмечено как выполненное
  date: Date;

  // необязательное поле – значение для численных привычек,
  // например, 12000 для привычки "пройти 10000 шагов"
  value?: number;
}