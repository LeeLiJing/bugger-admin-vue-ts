import { createStore } from 'vuex';
import { CoreStore } from '@/types';

const store = createStore({
    strict: true
}) as CoreStore<any>;

export default store;
