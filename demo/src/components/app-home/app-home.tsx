import { State, Component, h } from '@stencil/core';
import { InputType, OptionType, IonInputList, makeInputItems } from 'ion-input-list';

let types: InputType<any>[] = [
// ion-input
  'date', 'email', 'number', 'password', 'search', 'tel', 'text', 'time', 'url',
  // ion-datetime
  'datetime',
  // ion-textarea
  'textarea',
];
let options: OptionType<any>[] = types.filter(s => typeof s === 'string').map(x => {
  let s = x as string;
  return ({
    value: s,
    text: s,
  });
});
// ion-select
types.push({ type: 'select', options, multiple: false });
types.push({ type: 'select', options, multiple: true });
// ion-radio-group
types.push({ type: 'radio', options });

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  scoped: true,
})
export class AppHome {
  @State() valueObject: any = {};
  @State() tick = {};

  update = () => {
    if (this.valueObject) {
      localStorage.setItem('value', JSON.stringify(this.valueObject));
    }
    this.tick = {};
  };

  connectedCallback() {
    try {
      this.valueObject = JSON.parse(localStorage.getItem('value'));
    } catch (e) {
    }
    if (!this.valueObject || typeof this.valueObject !== 'object') {
      this.valueObject = {};
    }
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>
            IonInputList Demo
          </ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content class="ion-padding">
        <div class='container'>
          <IonInputList
            items={makeInputItems(this.valueObject, types.map(type => {
              let label = typeof type === 'string' ? type : (type.type);
              return ({
                label,
                key: label,
                type,
                placeholder: 'the placeholder',
              });
            }))}
            triggerRender={this.update}
          />
          <pre><code>{JSON.stringify(this.valueObject, null, 2)}</code></pre>
        </div>
      </ion-content>,
    ];
  }
}
