interface StepAction {
  text: string;
  href: string;
}

export interface Step {
  id: number;
  icon: string;
  title: string;
  actions?: StepAction[];
}
