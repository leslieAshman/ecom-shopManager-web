/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DisplayForm, { DisplayFormProps, DisplayFormTestIds } from '../DisplayForm';

const sections = [
  {
    itemSize: 6,
    fields: [
      {
        id: 'accountName',
        name: 'accountName',
        ariaLabel: 'account-name',
        className: '',
        translationKey: ``,
        placeholder: '',
        disabled: false,
        label: {
          text: 'Field label',
          isShow: false,
          variant: 'subtitle2',
        },
      },
    ],
  },
];

const model = {
  modelType: 'Testing Model',
  amount: '',
};

const renderDisplayForm = <T extends { modelType: string | undefined }>(formArgs: DisplayFormProps<T>) =>
  render(<DisplayForm {...formArgs} />);

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (key: string) => key,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

describe('<DisplayForm />', () => {
  it('Field id: accountName is rendered', () => {
    renderDisplayForm<typeof model>({ sections, model });
    expect(screen.getByTestId(/^accountName$/i)).toBeDefined();
  });

  it('Form renders title and subTitle when specified', () => {
    const title = 'Some title';
    const subTitle = 'Some subTitle';
    renderDisplayForm<typeof model>({ title, subTitle, sections, model });
    expect(screen.getByTestId(DisplayFormTestIds.TITLE).textContent).toBe(title);
    expect(screen.getByTestId(DisplayFormTestIds.SUBTITLE).textContent).toBe(subTitle);
  });

  it('Form does not render title and subTitle when not specified', () => {
    renderDisplayForm<typeof model>({
      sections,
      model,
    });
    expect(screen.queryByTestId(DisplayFormTestIds.TITLE)).toBeNull();
    expect(screen.queryByTestId(DisplayFormTestIds.SUBTITLE)).toBeNull();
  });

  it('No unexpected is thrown when section = [null]', () => {
    let isErrorThrown = false;
    try {
      renderDisplayForm<typeof model>({
        sections: [null as any],
        model,
      });
    } catch (err) {
      isErrorThrown = true;
    }
    expect(isErrorThrown).toBeFalsy();
  });

  it('No unexpected is thrown when section = [undefined]', () => {
    let isErrorThrown = false;
    try {
      renderDisplayForm<typeof model>({
        sections: [undefined as any],
        model,
      });
    } catch (err) {
      isErrorThrown = true;
    }
    expect(isErrorThrown).toBeFalsy();
  });
  it('No expection is thrown when sections = [{}]', () => {
    let isErrorThrown = false;
    try {
      renderDisplayForm<typeof model>({
        sections: [{} as any],
        model,
      });
    } catch (err) {
      isErrorThrown = true;
    }
    expect(isErrorThrown).toBeFalsy();
  });

  it('No exception is thrown when model is null', () => {
    let isErrorThrown = false;
    try {
      renderDisplayForm<typeof model>({
        sections,
        model: null as any,
      });
    } catch (err) {
      isErrorThrown = true;
    }
    expect(isErrorThrown).toBeFalsy();
  });
  it('No exception is thrown when model is undefined', () => {
    let isErrorThrown = false;
    try {
      renderDisplayForm<typeof model>({
        sections,
        model: undefined as any,
      });
    } catch (err) {
      isErrorThrown = true;
    }
    expect(isErrorThrown).toBeFalsy();
  });

  it('Fields rendered can be updated', async () => {
    let accountName = 'Test';
    let expectedFieldId = '';

    renderDisplayForm<typeof model>({
      sections,
      model,
      onChange: (value, fieldId) => {
        accountName = value;
        expectedFieldId = fieldId;
      },
    });
    const input = screen.getByTestId(/^accountName$/i);
    fireEvent.change(input, { target: { value: 'Tester' } });
    fireEvent.blur(input);
    await waitFor(() => {
      expect(expectedFieldId).toBe('accountName');
      expect(accountName).toBe('Tester');
    });
  });
});
