import React from 'react';

import { render, screen } from '../../../utils/test-utils';
import * as Icons from '../icons';

describe('<Icon />', () => {
  it('renders at the correct size', () => {
    const { rerender } = render(<Icons.IconMoon data-testid="moon" />);
    const icon = screen.getByTestId('moon');

    expect(icon).toBeInstanceOf(SVGSVGElement);
    expect(icon).toHaveAttribute('width', '32');

    rerender(<Icons.IconMoon size="16" data-testid="moon" />);
    expect(icon).toHaveAttribute('width', '16');
  });

  it('hides icons from assistive tech when a title is not provided', () => {
    render(<Icons.IconMoon data-testid="moon" />);

    expect(screen.getByTestId('moon')).toHaveAttribute('aria-hidden');
  });

  it('applies an ARIA role attribute when passed a label', () => {
    render(<Icons.IconMoon label="Dark" labelId="theme" data-testid="moon" />);

    const icon = screen.getByTestId('moon');

    expect(icon).toHaveAttribute('role', 'img');
    expect(icon).toHaveAttribute('aria-labelledby', 'theme');
    expect(screen.getByText('Dark')).toHaveAttribute('id', 'theme');
  });
});

Object.keys(Icons).forEach((icon) => {
  const IconComponent = Icons[icon];

  // eslint-disable-next-line jest/valid-title
  describe(`<${IconComponent.name} />`, () => {
    it('should match snapshot', async () => {
      expect.assertions(1);
      const { container } = render(<IconComponent />);
      expect(container.firstElementChild).toMatchSnapshot();
    });
  });
});
