import React from 'react';

import { Icon } from '../../_private/Icon';
import type { BaseIconProps } from '../../_private/Icon';

export type IconSunProps = BaseIconProps;

export function IconSun(props: IconSunProps) {
  return <Icon icon="sun" {...props} />
}
