import { SelectableValue } from '@grafana/data';
import React from 'react';
import { FormInputSize } from '../Forms/types';

export type SelectValue<T> = T | SelectableValue<T> | T[] | Array<SelectableValue<T>>;

export interface SelectCommonProps<T> {
  allowCustomValue?: boolean;
  /** Focus is set to the Select when rendered*/
  autoFocus?: boolean;
  backspaceRemovesValue?: boolean;
  className?: string;
  /** Used for custom components. For more information, see `react-select` */
  components?: any;
  defaultValue?: any;
  disabled?: boolean;
  /**   Function for formatting the text that is displayed when creating a new value*/
  formatCreateLabel?: (input: string) => string;
  getOptionLabel?: (item: SelectableValue<T>) => string;
  getOptionValue?: (item: SelectableValue<T>) => string;
  inputValue?: string;
  isClearable?: boolean;
  isLoading?: boolean;
  isMulti?: boolean;
  isOpen?: boolean;
  /** Disables the possibility to type into the input*/
  isSearchable?: boolean;
  maxMenuHeight?: number;
  menuPlacement?: 'auto' | 'bottom' | 'top';
  menuPosition?: 'fixed' | 'absolute';
  /** The message to display when no options could be found */
  noOptionsMessage?: string;
  onBlur?: () => void;
  onChange: (value: SelectableValue<T>) => {} | void;
  onCloseMenu?: () => void;
  /** allowCustomValue must be enabled. Function decides what to do with that custom value. */
  onCreateOption?: (value: string) => void;
  onInputChange?: (label: string) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onOpenMenu?: () => void;
  openMenuOnFocus?: boolean;
  options?: Array<SelectableValue<T>>;
  placeholder?: string;
  /** item to be rendered in front of the input */
  prefix?: JSX.Element | string | null;
  /** Use a custom element to control Select. A proper ref to the renderControl is needed if 'portal' isn't set to null*/
  renderControl?: ControlComponent<T>;
  size?: FormInputSize;
  tabSelectsValue?: boolean;
  value?: SelectValue<T>;
  width?: number;
}

export interface SelectAsyncProps<T> {
  /** When specified as boolean the loadOptions will execute when component is mounted */
  defaultOptions?: boolean | Array<SelectableValue<T>>;
  /** Asynchronously load select options */
  loadOptions?: (query: string) => Promise<Array<SelectableValue<T>>>;
  /** Message to display when options are loading */
  loadingMessage?: string;
}

export interface MultiSelectCommonProps<T> extends Omit<SelectCommonProps<T>, 'onChange' | 'isMulti' | 'value'> {
  value?: Array<SelectableValue<T>> | T[];
  onChange: (item: Array<SelectableValue<T>>) => {} | void;
}

export interface SelectBaseProps<T> extends SelectCommonProps<T>, SelectAsyncProps<T> {
  invalid?: boolean;
}

export interface CustomControlProps<T> {
  ref: React.Ref<any>;
  isOpen: boolean;
  /** Currently selected value */
  value?: SelectableValue<T>;
  /** onClick will be automatically passed to custom control allowing menu toggle */
  onClick: () => void;
  /** onBlur will be automatically passed to custom control closing the menu on element blur */
  onBlur: () => void;
  disabled: boolean;
  invalid: boolean;
}

export type ControlComponent<T> = React.ComponentType<CustomControlProps<T>>;

export interface SelectableOptGroup<T = any> {
  label: string;
  options: Array<SelectableValue<T>>;
  [key: string]: any;
}

export type SelectOptions<T = any> =
  | SelectableValue<T>
  | Array<SelectableValue<T> | SelectableOptGroup<T> | Array<SelectableOptGroup<T>>>;
