export declare interface Token {
  expire: number
  refreshExpire: number
  token: string
  refreshToken: string
}

export declare enum MenuType {
  '目录' = 0,
  '菜单' = 1,
  '权限' = 2
}
