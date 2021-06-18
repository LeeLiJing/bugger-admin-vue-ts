import { computed, defineComponent, ref, watch, h } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import './index.scss';

export default defineComponent({
    name: 'MenuSlider',
    setup() {
        const router = useRouter();
        const route = useRoute();
        const store = useStore();

        // 是否可见
        const visible = ref<boolean>(true);

        // 菜单列表
        const menuList = computed(() => store.getters.menuList);

        // 菜单是否折叠
        const menuCollapse = computed(() => store.getters.menuCollapse);

        // 浏览器信息
        const browser: any = computed(() => store.getters.browser);

        // 页面跳转
        const toView = (url: string) => {
            if (url != route.path) {
                router.push(url);
            }
        };

        // 刷新菜单
        const refresh = () => {
            visible.value = false;

            setTimeout(() => {
                visible.value = true;
            }, 0);
        };

        // 监听菜单变化
        watch(menuList, refresh);

        return { route, visible, menuList, menuCollapse, browser, toView, refresh };
    },
    render(ctx: any) {
        const deepMenu = (list: any) => {
            return list
                .filter((e: any) => e.isShow)
                .map((e: any) => {
                    let html = null;

                    if (e.type == 0) {
                        html = h(
                            <el-submenu></el-submenu>,
                            {
                                index: String(e.id),
                                key: e.id
                            },
                            {
                                title: () => {
                                    return !ctx.menuCollapse ? (
                                        <span>
											<icon-svg name={e.icon}></icon-svg>
											<span>{e.name}</span>
										</span>
                                    ) : (
                                        <icon-svg name={e.icon}></icon-svg>
                                    );
                                },
                                default() {
                                    return deepMenu(e.children);
                                }
                            }
                        );
                    } else {
                        html = h(
                            <el-menu-item></el-menu-item>,
                            {
                                index: e.path,
                                key: e.id
                            },
                            {
                                title() {
                                    return <span>{e.name}</span>;
                                },
                                default() {
                                    return <icon-svg name={e.icon}></icon-svg>;
                                }
                            }
                        );
                    }

                    return html;
                });
        };
        const children = deepMenu(ctx.menuList);
        return (ctx && (
            <div class="app-menu-slider">
                <el-menu
                    default-active={ctx.route.path}
                    background-color="transparent"
                    collapse-ransition={false}
                    collapse={ctx.browser.isMini ? false : ctx.menuCollapse}
                    onSelect={ctx.toView}
                >{children}
                </el-menu>
            </div>
        ));
    }
});
