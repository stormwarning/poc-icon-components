import React from 'react';

import * as Icons from '../icons';
import { Icon } from './Icon';

function AllIcons() {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {Object.keys(Icons).map((icon) => {
        const IconComponent = Icons[icon];
        const name = String(IconComponent.name).split(/^Icon/)[1];

        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '1rem',
            }}
            key={IconComponent.name}
            title={name}
          >
            <IconComponent />
          </div>
        );
      })}
    </div>
  );
}

export default {
  title: 'Base/Icons',
  component: Icon,
};

export const library = () => <AllIcons />;
