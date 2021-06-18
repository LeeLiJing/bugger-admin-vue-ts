const baseMenu = {
    label: '首页',
    value: '/',
    active: true
};

const tagViewStore = {
    state: {
        list: [ baseMenu ]
    },
    getters: {
        // 标签页列表
        tagViewList: (state: any) => state.list
    },
    mutations: {
        ADD_TAG_VIEWS(state: any, item: any) {
            const index = state.list.findIndex((e: any) => e.value.split('?')[0] === item.value.split('?')[0]);

            state.list.map((e: any) => {
                e.active = e.value == item.value;
            });

            if (index < 0) {
                if (item.value == '/') {
                    item.label = baseMenu.label;
                }

                if (item.label) {
                    state.list.push({
                        ...item,
                        active: true
                    });
                }
            } else {
                state.list[index].active = true;
                state.list[index].label = item.label;
                state.list[index].value = item.value;
            }
        },
        DEL_TAG_VIEWS(state: any, index: number) {
            if (index != 0) {
                state.list.splice(index, 1);
            }
        },
        SET_TAG_VIEWS(state: any, list: Array<any>) {
            state.list = list;
        },
        RESET_TAG_VIEWS(state: any) {
            state.list = [ baseMenu ];
        }
    }
};

export default tagViewStore;
