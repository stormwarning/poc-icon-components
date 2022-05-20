import React from 'react';

import { Icon } from '../../_private/Icon';
import type { BaseIconProps } from '../../_private/Icon';

export type IconMoonProps = BaseIconProps;

export function IconMoon(props: IconMoonProps) {
  return <Icon icon="moon" {...props} />
}
