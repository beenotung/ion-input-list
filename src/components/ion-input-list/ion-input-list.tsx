import { h } from '@stencil/core';
import { ChildType } from '@stencil/core/dist/declarations';
import { InputItemType, mapInputItems } from '../helper';
import { IonInputItem } from '../ion-input-item/ion-input-item';

export const IonInputList = <T, >(
  props: {
    items: Array<InputItemType<T> | ChildType | ChildType[]>,
    triggerRender: () => void,
  }) => {
  const component = {
    render() {
      return <ion-list>
        {mapInputItems(props.items, item => {
          return <IonInputItem item={item} triggerRender={props.triggerRender}/>;
        })}
      </ion-list>;
    },
  };
  return component.render();
};
