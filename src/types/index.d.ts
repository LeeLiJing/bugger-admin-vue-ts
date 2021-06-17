import { Router } from 'vue-router';
import { Store } from 'vuex';

export declare class CoreStore<S> extends Store<S> {
    service?: any;
}

export declare interface CoreRouter extends Router {
    $plugin?: {
        addViews(list: any[], options?: any): void
    }
}
