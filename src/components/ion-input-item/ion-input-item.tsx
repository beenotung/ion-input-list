import { h } from '@stencil/core';

import { getUpdateValue, InputItemType, OptionType } from '../helper';

export const IonInputItem = <T, >(props: {
  item: InputItemType<T>,
  triggerRender: () => void,
}) => {
  const component = {

    updateItem(item: InputItemType<T>, event: Event, value?: any) {
      // check if value is given
      if (arguments.length !== 3) {
        // no value
        if (!event.target) {
          return;
        }
        value = getUpdateValue(item.type, event);
      }
      if (item.onChange) {
        item.onChange(value, item.valueObject[item.key]);
        requestAnimationFrame(() => props.triggerRender());
        return;
      }
      item.valueObject[item.key] = value;
      props.triggerRender();
    },

    renderIonInput(label: string, input: ChildNode) {
      return (
        <ion-item>
          <ion-label position='stacked'>{label}</ion-label>
          {input}
        </ion-item>
      );
    },

    /**@deprecated use ion-select with multiple attr instead */
    renderCheckboxGroup(
      item: InputItemType<T> & {
        type: { type: 'select'; options: Array<OptionType<T>>; multiple: true };
      },
    ) {
      return (
        <ion-list>
          <ion-list-header>{item.label}</ion-list-header>
          {...item.type.options.map(option => (
            <ion-item>
              <ion-checkbox
                slot='start'
                onIonChange={(event: any) => component.updateItem(item, event, option.value)}
                checked={((item.valueObject[item.key] as any) as any[]).includes(
                  option.value,
                )}
                value={option.value as any}
              />
              <ion-label>{option.text}</ion-label>
            </ion-item>
          ))}
        </ion-list>
      );
    },

    renderInputItem(item: InputItemType<T>) {
      const label = item.label;
      const type = item.type || 'text';
      const value = item.valueObject[item.key];
      switch (type) {
        case 'date':
        case 'email':
        case 'number':
        case 'password':
        case 'search':
        case 'tel':
        case 'text':
        case 'time':
        case 'url':
          return component.renderIonInput(label, <ion-input
            type={type}
            placeholder={item.placeholder}
            value={value as any}
            onIonChange={(e: Event) => component.updateItem(item, e)}
            autoCorrect={'on'}
            autocomplete={'on'}
            autoCapitalize={'on'}
          />);
        case 'datetime':
          return component.renderIonInput(label, <ion-datetime
            displayFormat='D MMM YYYY'
            placeholder={item.placeholder}
            onIonChange={(e: Event) => component.updateItem(item, e)}
            min={item.min}
            max={item.max}
            value={value as any}
          />);
        case 'textarea':
          return component.renderIonInput(label, <ion-textarea
            placeholder={item.placeholder}
            value={value as any}
            onIonChange={(e: Event) => component.updateItem(item, e)}
            autoGrow={true}
            autoCorrect={'on'}
            autoCapitalize={'on'}
          />);
        default:
          if (!type) {
            console.error('unknown type of ion-input-item:', item);
            return;
          }
          if (type.type === 'datetime') {
            const d = typeof value === 'number' ? new Date(value) : undefined;
            const date = d ? d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() : undefined;
            const time = d ? d.getHours() + ':' + d.getMinutes() : undefined;
            return [
              <ion-item>
                <ion-label>{type.dateLabel || label}</ion-label>
                <ion-input
                  type='date'
                  placeholder={item.placeholder}
                  // TODO
                  value={date}
                  onIonChange={(e: Event) => {
                    if (!e.target) {
                      return;
                    }
                    const newD = new Date((e.target as HTMLInputElement).value);
                    if (d) {
                      newD.setHours(d.getHours());
                      newD.setMinutes(d.getMinutes());
                      // newD.setSeconds(d.getMinutes());
                      // newD.setMilliseconds(d.getMilliseconds());
                      newD.setSeconds(0);
                      newD.setMilliseconds(0);
                    }
                    if (item.onChange) {
                      item.onChange(newD.getTime() as any, value);
                      requestAnimationFrame(() => props.triggerRender());
                    } else {
                      item.valueObject[item.key] = newD.getTime() as any;
                      props.triggerRender();
                    }
                  }}
                />
              </ion-item>,
              <ion-item>
                <ion-label>{type.timeLabel || label}</ion-label>
                <ion-input
                  type='time'
                  placeholder={item.placeholder}
                  // TODO
                  value={time}
                  onIonChange={(e: Event) => {
                    if (!e.target) {
                      return;
                    }
                    const s = (e.target as HTMLInputElement).value;
                    const [h, m] = s.split(':');
                    const newD = new Date();
                    newD.setHours(+h);
                    newD.setMinutes(+m);
                    newD.setSeconds(0);
                    newD.setMilliseconds(0);
                    if (d) {
                      newD.setFullYear(d.getFullYear());
                      newD.setMonth(d.getMonth());
                      newD.setDate(d.getDate());
                    }
                    if (item.onChange) {
                      item.onChange(newD.getTime() as any, value);
                      requestAnimationFrame(() => props.triggerRender());
                    } else {
                      item.valueObject[item.key] = newD.getTime() as any;
                      props.triggerRender();
                    }
                  }}
                />
              </ion-item>,
            ];
          }
          // enum options, use radio or checkbox
          if (type.type === 'select') {
            return component.renderIonInput(label, <ion-select
              placeholder={item.placeholder}
              value={value}
              onIonChange={(e: Event) => component.updateItem(item, e)}
              multiple={type.multiple}
            >{type.options.map(option => <ion-select-option
              value={option.value}
              selected={type.multiple
                ? Array.isArray(value) && value.includes(option.value)
                : value === option.value}
            >{option.text}</ion-select-option>)}</ion-select>);
          }
          if (type.type === 'radio') {
            return <ion-radio-group
              value={value}
              onIonChange={(e: Event) => component.updateItem(item, e)}
            >
              <ion-list-header>
                <ion-label>{label}</ion-label>
              </ion-list-header>
              {type.options.map(option => <ion-item>
                <ion-label>{option.text}</ion-label>
                <ion-radio slot='start' value={option.value}/>
              </ion-item>)}
            </ion-radio-group>;
          }
          const x: never = type;
          console.error('unknown ion-input-item type:', x);
          return;
      }
    },

    render() {
      return component.renderInputItem(props.item);
    },
  };

  return component.render();
};
