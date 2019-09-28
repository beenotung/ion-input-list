import { ChildType } from '@stencil/core/dist/declarations';

export type OptionType<T = never> = { text: string; value: T };

/**
 * value: format
 *    date: YYYY-MM-DD
 *    time: HH:MM
 *    datetime: Date.toString() (with timezone info)
 *    number: number
 *    other: string
 * */
export type InputType<T> =
  // ion-input
  // type list see: https://ionicframework.com/docs/api/input
  | 'date'
  | 'email'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  // ion-textarea
  | 'textarea'
  // ion-datetime
  | { type: 'datetime'; dateLabel?: string; timeLabel?: string }
  // ion-select
  | { type: 'select'; options: Array<OptionType<T>>; multiple?: boolean }
  // ion-radio-group
  | { type: 'radio'; options: Array<OptionType<T>> };

export type InputItemPart<T, K extends keyof T = keyof T> = {
  label: string;
  key: K;
  // default text
  type?: InputType<T[K]>;
  placeholder?: string;
  min?: string;
  max?: string;
  // will override default handling, i.e. will not auto update valueObject[key]
  // only implemented for checkbox group
  onChange?: (newValue: T[K], oldValue: T[K]) => void;
};

export type InputItemType<T, K extends keyof T = keyof T> = InputItemPart<
  T,
  K
> & {
  valueObject: T;
};

export function mapInputItems<T extends InputItemPart<any, any>, R>(
  items: Array<T | ChildType | ChildType[]>,
  f: (item: T) => R,
): Array<R | ChildType | ChildType[]> {
  return items.map(item => {
    if (typeof item === 'string' || typeof item === 'number') {
      return item as ChildType;
    }
    if (Array.isArray(item)) {
      return item as ChildType[];
    }
    const itemPart = item as InputItemPart<any>;
    if (
      typeof itemPart !== 'object' ||
      itemPart.label === undefined ||
      itemPart.key === undefined
    ) {
      return item as ChildType;
    }
    return f(itemPart as T);
  });
}

export function makeInputItems<T>(
  valueObject: T,
  items: Array<InputItemPart<T> | ChildType | ChildType[]>,
): Array<InputItemType<T> | ChildType | ChildType[]> {
  return mapInputItems(items, item => {
    return {
      ...item,
      valueObject,
    };
  });
}

export function getUpdateValue<T>(
  type: InputType<T> | undefined,
  event: Event,
): T | undefined {
  if (!event.target) {
    return;
  }
  const target = event.target as HTMLInputElement;
  const value = target.value;
  switch (type) {
    case 'date':
      // YYYY-MM-DD
      return value as any;
    case 'time':
      // HH:MM
      return value as any;
    case 'datetime':
      return new Date(value).getTime() as any;
    case 'number':
      return (value ? +value : undefined) as any;
    case 'email':
    case 'text':
    case 'textarea':
    case 'search':
    case 'tel':
    case 'url':
    case 'password':
      return value as any;
    default:
      if (!type) {
        console.error('unknown type:', type);
        return undefined;
      }
      if (type.type === 'datetime') {
        // TODO
        return value as any;
      }
      // enum options, use radio or checkbox
      if (type.type === 'select' || type.type === 'radio') {
        return value as any;
      }
      console.error('unknown type:', type);
      return undefined;
  }
}
