import React from 'react';

import type { AllOrNone } from '../../types';

export type OptionalTitle = AllOrNone<{ label: string; labelId: string }>;
export type BaseIconProps = {
  size?: '32' | '24' | '20' | '16';
} & OptionalTitle;

type IconProps = {
  icon: string;
} & BaseIconProps;

export function Icon({
  icon,
  size = '32',
  label,
  labelId,
  ...props
}: IconProps) {
  const sizeAttributes = {
    width: size,
    height: size,
  };
  const a11yAttributes = label
    ? {
        role: 'img',
        'aria-labelledby': labelId,
      }
    : { 'aria-hidden': true };

  return (
    <svg {...sizeAttributes} {...a11yAttributes} {...props}>
      {label ? <title id={labelId}>{label}</title> : null}
      <use xlinkHref={`/icon-sprite.svg#${icon}`} />
    </svg>
  );
}
