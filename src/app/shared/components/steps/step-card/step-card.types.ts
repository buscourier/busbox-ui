interface StepAction {
  text: string;
  href: string;
  type: 'route' | 'tel' | 'email';
}

export interface Step {
  id: number;
  icon: string;
  title: string;
  actions?: StepAction[];
}
