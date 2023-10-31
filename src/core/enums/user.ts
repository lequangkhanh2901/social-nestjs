export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
  LOCKED = 'LOCKED',
}

export enum UserRoles {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  NORMAL = 'NORMAL',
}

export enum UserSex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum RelationWithUser {
  FRIEND = 'FRIEND',
  NONE = 'NONE',
  WAITING_ACCEPT_BY_USER = 'WAITING_ACCEPT_BY_USER',
  WAITING_ACCEPT_BY_ME = 'WAITING_ACCEPT_BY_ME',
}
