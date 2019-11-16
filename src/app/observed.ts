// tslint:disable:only-arrow-functions

import { Observable, Subscription } from 'rxjs';
import { ɵmarkDirty } from '@angular/core';

const noop = () => {
};

const getCmp = type => (type).ɵcmp;
const subscriptionsSymbol = Symbol('__ng__subscriptions');

export function observed() {
  return function(target, propertyKey: string, descriptor?: PropertyDescriptor) {
    if (descriptor) {
      const original = descriptor.value;
      descriptor.value = function(...args: any[]) {
        original.apply(this, args);
        ɵmarkDirty(this);
      };
    } else {
      const cmp = getCmp(target.constructor);
      const onInit = cmp.onInit || noop;
      const onDestroy = cmp.onDestroy || noop;

      const getSubscriptions = (ctx) => {
        if (ctx[subscriptionsSymbol]) {
          return ctx[subscriptionsSymbol];
        }

        ctx[subscriptionsSymbol] = new Subscription();
        return ctx[subscriptionsSymbol];
      };

      const checkProperty = function(name: string) {
        const ctx = this;

        if (ctx[name] instanceof Observable) {
          const subscriptions = getSubscriptions(ctx);
          subscriptions.add(ctx[name].subscribe(() => ɵmarkDirty(ctx)));
        } else {
          const handler = {
            set(obj, prop, value) {
              obj[prop] = value;
              ɵmarkDirty(ctx);
              return true;
            }
          };

          ctx[name] = new Proxy(ctx, handler);
        }
      };

      const checkComponentProperties = (ctx) => {
        const props = Object.getOwnPropertyNames(ctx);

        props.map((prop) => {
          return Reflect.get(target, prop);
        }).filter(Boolean).forEach(() => {
          checkProperty.call(ctx, propertyKey);
        });
      };

      cmp.onInit = function() {
        const ctx = this;
        checkComponentProperties(ctx);
        onInit.call(ctx);
      };

      cmp.onDestroy = function() {
        const ctx = this;
        if (ctx[subscriptionsSymbol]) {
          ctx[subscriptionsSymbol].unsubscribe();
        }
        onDestroy.call(ctx);
      };

      Reflect.set(target, propertyKey, true);
    }
  };
}
