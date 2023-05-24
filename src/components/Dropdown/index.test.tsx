/* eslint-disable testing-library/no-wait-for-side-effects */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import Dropdown, { DropdownItem } from '.';

const placeholder = 'Select option';
const ddlOptions = [
  {
    id: '1',
    value: 'Option A',
    content: (
      <div className="flex justify-between text-base">
        <span>Option A</span>
      </div>
    ),
  },
  {
    id: '2',
    value: 'Option B',
    content: (
      <div className="flex justify-between text-base">
        <span>Option B</span>
      </div>
    ),
  },
];

const renderDropdown = (value?: string, items = ddlOptions, onChange?: (item: DropdownItem) => void) =>
  render(
    <Dropdown
      placeholder={placeholder}
      value={value}
      onItemSelect={onChange || (() => {})}
      items={items}
      className="flex-1"
    />,
  );

describe('Dropdown', () => {
  it('Render with first item selected', () => {
    renderDropdown(ddlOptions[0].value);
    const regx = new RegExp(ddlOptions[0].value, 'i');
    const button = screen.getByRole('button', { name: regx });
    expect(button).toBeInTheDocument();
  });

  it('Render placeholder text, value="', async () => {
    renderDropdown('');
    expect(screen.getByText(placeholder)).toBeInTheDocument();
  });

  it('No error thrown, items= []', async () => {
    renderDropdown('', []);
    expect(screen.getByText(placeholder)).toBeInTheDocument();
  });

  it('Select option B', async () => {
    let result = '';
    renderDropdown('', ddlOptions, (item: DropdownItem) => {
      result = item.id;
    });
    const button = screen.getByRole('button');
    fireEvent.click(button);

    const optionBRegx = new RegExp(ddlOptions[1].value, 'i');
    await waitFor(() => {
      const menuItemOptionB = screen.getByRole('menuitem', { name: optionBRegx });
      fireEvent.click(menuItemOptionB);
    });

    await waitFor(() => {
      expect(ddlOptions[1].id).toBe(result);
    });
  });
});
