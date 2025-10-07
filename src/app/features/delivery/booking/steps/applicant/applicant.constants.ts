import type { BaseTab } from '@shared/types';

import { ApplicantType } from '../../types';

export const ApplicantTabs: BaseTab<ApplicantType>[] = [
  {
    id: ApplicantType.INDIVIDUAL,
    name: 'Физическое лицо',
  },
  {
    id: ApplicantType.LEGAL,
    name: 'Юридическое лицо',
  },
];
